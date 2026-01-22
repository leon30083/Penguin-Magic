import { Node, Edge } from '@xyflow/react';
import { CanvasNodeData } from '../components/Canvas';

/**
 * 工作流存储管理 (从 WinJin 移植)
 * 支持保存、加载、删除多个命名工作流
 */

const STORAGE_KEY = 'penguin-magic-workflows';
const CURRENT_WORKFLOW_KEY = 'penguin-magic-current-workflow';

export interface WorkflowData {
  name: string;
  description?: string;
  nodes: Node<CanvasNodeData>[];
  edges: Edge[];
  updatedAt: string;
  createdAt: string;
}

export interface WorkflowListItem {
  name: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  nodeCount: number;
  edgeCount: number;
}

export class WorkflowStorage {
  /**
   * 获取所有已保存的工作流
   */
  static getAllWorkflows(): Record<string, WorkflowData> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load workflows:', error);
      return {};
    }
  }

  /**
   * 保存工作流
   * @param name - 工作流名称
   * @param nodes - 节点数组
   * @param edges - 连线数组
   * @param description - 工作流描述（可选）
   */
  static saveWorkflow(
    name: string,
    nodes: Node<CanvasNodeData>[],
    edges: Edge[],
    description = ''
  ): { success: boolean; data?: WorkflowData; error?: string } {
    try {
      const workflows = this.getAllWorkflows();

      // 深拷贝节点，确保所有 data 都被序列化
      // React Flow 的 nodes 可能包含循环引用或不可序列化的数据
      const serializedNodes = JSON.parse(JSON.stringify(nodes, (key, value) => {
        // 跳过 React 内部属性
        if (key.startsWith('_') || key === 'reactFlowInternal') {
          return undefined;
        }
        return value;
      })) as Node<CanvasNodeData>[];

      // 深拷贝 edges
      const serializedEdges = JSON.parse(JSON.stringify(edges)) as Edge[];

      workflows[name] = {
        name,
        description,
        nodes: serializedNodes,
        edges: serializedEdges,
        updatedAt: new Date().toISOString(),
        createdAt: workflows[name]?.createdAt || new Date().toISOString(),
      };

      console.log(`[WorkflowStorage] 保存工作流 "${name}":`, {
        nodeCount: serializedNodes.length,
        edgeCount: serializedEdges.length,
        // 记录关键节点的关键数据
        keyNodes: serializedNodes.map(n => ({
          id: n.id,
          type: n.type,
          hasData: !!n.data,
        }))
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
      localStorage.setItem(CURRENT_WORKFLOW_KEY, name);
      return { success: true, data: workflows[name] };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to save workflow:', error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * 加载工作流
   * @param name - 工作流名称
   */
  static loadWorkflow(
    name: string
  ): { success: boolean; data?: WorkflowData; error?: string } {
    try {
      const workflows = this.getAllWorkflows();
      const workflow = workflows[name];
      if (!workflow) {
        return { success: false, error: 'Workflow not found' };
      }
      localStorage.setItem(CURRENT_WORKFLOW_KEY, name);
      return { success: true, data: workflow };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to load workflow:', error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * 删除工作流
   * @param name - 工作流名称
   */
  static deleteWorkflow(
    name: string
  ): { success: boolean; error?: string } {
    try {
      const workflows = this.getAllWorkflows();
      if (!workflows[name]) {
        return { success: false, error: 'Workflow not found' };
      }
      delete workflows[name];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));

      // 如果删除的是当前工作流，清除当前工作流标记
      const current = localStorage.getItem(CURRENT_WORKFLOW_KEY);
      if (current === name) {
        localStorage.removeItem(CURRENT_WORKFLOW_KEY);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to delete workflow:', error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * 获取当前工作流名称
   */
  static getCurrentWorkflowName(): string | null {
    return localStorage.getItem(CURRENT_WORKFLOW_KEY);
  }

  /**
   * 获取工作流列表（用于显示）
   */
  static getWorkflowList(): WorkflowListItem[] {
    try {
      const workflows = this.getAllWorkflows();
      return Object.values(workflows)
        .map(w => ({
          name: w.name,
          description: w.description || '',
          updatedAt: w.updatedAt,
          createdAt: w.createdAt,
          nodeCount: w.nodes?.length || 0,
          edgeCount: w.edges?.length || 0,
        }))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (error) {
      console.error('Failed to get workflow list:', error);
      return [];
    }
  }

  /**
   * 导出工作流为 JSON 文件
   * @param name - 工作流名称
   */
  static exportWorkflow(
    name: string
  ): { success: boolean; error?: string } {
    try {
      const workflows = this.getAllWorkflows();
      const workflow = workflows[name];
      if (!workflow) {
        return { success: false, error: 'Workflow not found' };
      }

      const blob = new Blob([JSON.stringify(workflow, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workflow-${name}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to export workflow:', error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * 从 JSON 文件导入工作流
   * @param file - JSON 文件
   */
  static async importWorkflow(
    file: File
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const text = await file.text();
      const workflow = JSON.parse(text) as WorkflowData;

      if (!workflow.name || !workflow.nodes || !workflow.edges) {
        return { success: false, error: 'Invalid workflow file format' };
      }

      // 重命名以避免冲突
      const workflows = this.getAllWorkflows();
      let name = workflow.name;
      let counter = 1;
      while (workflows[name]) {
        name = `${workflow.name} (${counter})`;
        counter++;
      }

      const result = this.saveWorkflow(name, workflow.nodes, workflow.edges, workflow.description);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to import workflow:', error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * 清除所有工作流
   */
  static clearAllWorkflows(): { success: boolean; error?: string } {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CURRENT_WORKFLOW_KEY);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to clear workflows:', error);
      return { success: false, error: errorMessage };
    }
  }
}
