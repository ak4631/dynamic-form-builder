<?php

namespace Optimust\Entity\Decorator;

use Optimust\Entity\WorkflowStateMachine;

class WorkflowStateMachineDecorator
{
    private WorkflowStateMachine $workflowStateMachine;

    /**
     * @param WorkflowStateMachine $workflowStateMachine
     */
    public function __construct(WorkflowStateMachine $workflowStateMachine)
    {
        $this->workflowStateMachine = $workflowStateMachine;
    }

    /**
     * @return WorkflowStateMachine
     */
    protected function getWorkflowStateMachine(): WorkflowStateMachine
    {
        return $this->workflowStateMachine;
    }

    /**
     * @return string[]|null
     */
    public function getRolesToNotify(): ?array
    {
        $rolesToNotify = $this->getWorkflowStateMachine()->getRolesToNotify();
        return is_null($rolesToNotify) ? null : explode(',', $rolesToNotify);
    }
}
