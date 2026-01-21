import { useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { CanvasNodeData } from '../components/Canvas';

/**
 * 工作流执行引擎 Hook (从 WinJin 移植)
 * 处理节点执行顺序、数据流和异步任务管理
 */
export function useWorkflowExecution() {
  const [executionState, setExecutionState] = useState({
    isRunning: false,
    currentNode: null as string | null,
    completedNodes: [] as string[],
    failedNodes: [] as string[],
    results: {} as Record<string, unknown>,
  });

  const [progress, setProgress] = useState({
    total: 0,
    completed: 0,
    failed: 0,
  });

  /**
   * 构建邻接表用于拓扑排序
   */
  const buildAdjacencyList = (nodes: Node<CanvasNodeData>[], edges: Edge[]) => {
    const graph: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};

    // 初始化图
    nodes.forEach(node => {
      graph[node.id] = [];
      inDegree[node.id] = 0;
    });

    // 构建边
    edges.forEach(edge => {
      graph[edge.source].push(edge.target);
      inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
    });

    return { graph, inDegree };
  };

  /**
   * 拓扑排序确定执行顺序
   */
  const topologicalSort = (nodes: Node<CanvasNodeData>[], edges: Edge[]): string[] => {
    const { graph, inDegree } = buildAdjacencyList(nodes, edges);
    const queue: string[] = [];
    const result: string[] = [];

    // 找到无依赖的节点（入度为 0）
    nodes.forEach(node => {
      if (inDegree[node.id] === 0) {
        queue.push(node.id);
      }
    });

    // 处理节点
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      result.push(nodeId);

      // 减少依赖节点的入度
      graph[nodeId].forEach(dependentId => {
        inDegree[dependentId]--;
        if (inDegree[dependentId] === 0) {
          queue.push(dependentId);
        }
      });
    }

    // 检测循环
    if (result.length !== nodes.length) {
      throw new Error('工作流中存在循环依赖');
    }

    return result;
  };

  /**
   * 从连接的源节点获取数据
   */
  const getNodeInputData = (
    nodeId: string,
    edges: Edge[],
    nodeResults: Record<string, unknown>
  ): Record<string, unknown> => {
    const inputData: Record<string, unknown> = {};

    // 查找此节点的所有入边
    const incomingEdges = edges.filter(edge => edge.target === nodeId);

    incomingEdges.forEach(edge => {
      const sourceResult = nodeResults[edge.source];
      if (!sourceResult) return;

      // 根据源句柄类型映射数据
      const sourceHandle = edge.sourceHandle || 'output';

      switch (sourceHandle) {
        case 'text-output':
          inputData.prompt = (sourceResult as any).text;
          break;
        case 'images-output':
          inputData.images = (sourceResult as any).images || [];
          break;
        case 'character-output':
          inputData.character = (sourceResult as any).character;
          break;
        case 'video-output':
          inputData.videoTaskId = (sourceResult as any).taskId;
          break;
        case 'characters-output':
          inputData.characters = (sourceResult as any).characters || [];
          break;
        default:
          inputData[sourceHandle] = sourceResult;
      }
    });

    return inputData;
  };

  /**
   * 执行单个节点
   */
  const executeNode = async (
    node: Node<CanvasNodeData>,
    inputData: Record<string, unknown>
  ): Promise<Record<string, unknown>> => {
    const { type, data } = node;

    switch (type) {
      case 'text':
        return { text: (data as any).text || inputData.text };

      case 'image':
        return { images: (data as any).images || inputData.images || [] };

      case 'character':
        return { character: (data as any).selectedCharacter || inputData.character };

      case 'characterLibrary':
        return { characters: (data as any).characters || inputData.characters || [] };

      case 'videoGenerate':
        // 视频生成在节点组件内部处理
        return { taskId: (data as any).taskId, result: (data as any).videoResult };

      case 'storyboard':
        // 故事板执行在节点组件内部处理
        return { taskIds: (data as any).taskIds, results: (data as any).results };

      case 'taskResult':
        // 任务结果节点显示视频任务结果
        return { taskId: inputData.videoTaskId || (data as any).taskId };

      default:
        console.warn(`Unknown node type: ${type}`);
        return {};
    }
  };

  /**
   * 执行整个工作流
   */
  const executeWorkflow = useCallback(async (nodes: Node<CanvasNodeData>[], edges: Edge[]) => {
    try {
      // 重置状态
      setExecutionState({
        isRunning: true,
        currentNode: null,
        completedNodes: [],
        failedNodes: [],
        results: {},
      });
      setProgress({ total: nodes.length, completed: 0, failed: 0 });

      console.log('[Workflow] 开始执行工作流');

      // 使用拓扑排序获取执行顺序
      const executionOrder = topologicalSort(nodes, edges);
      console.log('[Workflow] 执行顺序:', executionOrder.join(' → '));

      const results: Record<string, unknown> = {};
      const completedNodes: string[] = [];
      const failedNodes: string[] = [];

      // 按顺序执行节点
      for (const nodeId of executionOrder) {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) continue;

        const nodeLabel = node.data.label || nodeId;
        setExecutionState(prev => ({ ...prev, currentNode: nodeLabel }));
        console.log(`[Workflow] 执行节点: ${nodeLabel}`);

        // 从连接的源节点获取输入数据
        const inputData = getNodeInputData(nodeId, edges, results);

        // 执行节点
        try {
          const result = await executeNode(node, inputData);
          results[nodeId] = result;
          completedNodes.push(nodeId);

          setProgress(prev => ({
            ...prev,
            completed: prev.completed + 1,
          }));

          console.log(`[Workflow] ✓ 节点完成: ${nodeLabel}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`[Workflow] ✗ 节点失败: ${nodeLabel} - ${errorMessage}`);
          failedNodes.push(nodeId);

          setProgress(prev => ({
            ...prev,
            failed: prev.failed + 1,
          }));

          // 即使节点失败也继续执行
          results[nodeId] = { error: errorMessage };
        }
      }

      console.log(`[Workflow] 工作流执行完成: ${completedNodes.length}/${nodes.length} 成功`);
      if (failedNodes.length > 0) {
        console.warn(`[Workflow] ${failedNodes.length} 个节点执行失败`);
      }

      setExecutionState({
        isRunning: false,
        currentNode: null,
        completedNodes,
        failedNodes,
        results,
      });

      return { success: true, results, completedNodes, failedNodes };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[Workflow] 工作流执行错误:', errorMessage);
      setExecutionState(prev => ({
        ...prev,
        isRunning: false,
        currentNode: null,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * 重置执行状态
   */
  const resetExecution = useCallback(() => {
    setExecutionState({
      isRunning: false,
      currentNode: null,
      completedNodes: [],
      failedNodes: [],
      results: {},
    });
    setProgress({ total: 0, completed: 0, failed: 0 });
  }, []);

  return {
    executionState,
    progress,
    executeWorkflow,
    resetExecution,
  };
}
