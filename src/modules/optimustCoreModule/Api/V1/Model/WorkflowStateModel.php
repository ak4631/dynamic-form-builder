<?php

namespace Optimust\Core\Api\V1\Model;

use Optimust\Core\Api\V1\Serializer\Normalizable;
use Optimust\Entity\WorkflowStateMachine;

/**
 * @OA\Schema(
 *     schema="Core-WorkflowStateModel",
 *     type="object",
 *     @OA\Property(property="action", type="string"),
 *     @OA\Property(property="name", type="string")
 * )
 */
class WorkflowStateModel implements Normalizable
{
    private WorkflowStateMachine $workflowStateMachine;

    /**
     * @param WorkflowStateMachine $workflowStateMachine
     */
    public function __construct(WorkflowStateMachine $workflowStateMachine)
    {
        $this->workflowStateMachine = $workflowStateMachine;
    }

    public function toArray(): array
    {
        return [
            'action' => $this->workflowStateMachine->getAction(),
            'name' => ucwords(strtolower($this->workflowStateMachine->getAction())),
        ];
    }
}
