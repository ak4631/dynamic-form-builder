<?php

namespace Optimust\Entity;

use Doctrine\ORM\Mapping as ORM;
use Optimust\Entity\Decorator\DecoratorTrait;
use Optimust\Entity\Decorator\WorkflowStateMachineDecorator;

/**
 * @method WorkflowStateMachineDecorator getDecorator()
 */
#[ORM\Entity]
#[ORM\Table(name: 'workflow_state_machine')]
class WorkflowStateMachine
{
    use DecoratorTrait;

    /**
     * @var int
     */
    #[ORM\Column(name: 'id', type: 'bigint', length: 20)]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private int $id;

    /**
     * @var string
     */
    #[ORM\Column(name: 'workflow', type: 'string', length: 255)]
    private string $workflow;

    /**
     * @var string
     */
    #[ORM\Column(name: 'state', type: 'string', length: 255)]
    private string $state;

    /**
     * @var string
     */
    #[ORM\Column(name: 'role', type: 'string', length: 255)]
    private string $role;

    /**
     * @var string
     */
    #[ORM\Column(name: 'action', type: 'string', length: 255)]
    private string $action;

    /**
     * @var string
     */
    #[ORM\Column(name: 'resulting_state', type: 'string', length: 255)]
    private string $resultingState;

    /**
     * @var string|null
     */
    #[ORM\Column(name: 'roles_to_notify', type: 'text', nullable: true)]
    private ?string $rolesToNotify;

    /**
     * @var int
     */
    #[ORM\Column(name: 'priority', type: 'integer', options: ['default' => 0])]
    private int $priority;

    public function __construct()
    {
        $this->priority = 0;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId(int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getWorkflow(): string
    {
        return $this->workflow;
    }

    /**
     * @param string $workflow
     */
    public function setWorkflow(string $workflow): void
    {
        $this->workflow = $workflow;
    }

    /**
     * @return string
     */
    public function getState(): string
    {
        return $this->state;
    }

    /**
     * @param string $state
     */
    public function setState(string $state): void
    {
        $this->state = $state;
    }

    /**
     * @return string
     */
    public function getRole(): string
    {
        return $this->role;
    }

    /**
     * @param string $role
     */
    public function setRole(string $role): void
    {
        $this->role = $role;
    }

    /**
     * @return string
     */
    public function getAction(): string
    {
        return $this->action;
    }

    /**
     * @param string $action
     */
    public function setAction(string $action): void
    {
        $this->action = $action;
    }

    /**
     * @return string
     */
    public function getResultingState(): string
    {
        return $this->resultingState;
    }

    /**
     * @param string $resultingState
     */
    public function setResultingState(string $resultingState): void
    {
        $this->resultingState = $resultingState;
    }

    /**
     * @return string|null
     */
    public function getRolesToNotify(): ?string
    {
        return $this->rolesToNotify;
    }

    /**
     * @param string|null $rolesToNotify
     */
    public function setRolesToNotify(?string $rolesToNotify): void
    {
        $this->rolesToNotify = $rolesToNotify;
    }

    /**
     * @return int
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * @param int $priority
     */
    public function setPriority(int $priority): void
    {
        $this->priority = $priority;
    }
}
