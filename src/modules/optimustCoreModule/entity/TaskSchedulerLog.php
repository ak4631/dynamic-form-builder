<?php

namespace Optimust\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'task_scheduler_log')]
class TaskSchedulerLog
{
    /**
     * @var int
     */
    #[ORM\Column(name: 'id', type: 'integer')]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private int $id;

    /**
     * @var DateTime
     */
    #[ORM\Column(name: 'started_at', type: 'datetime', nullable: false)]
    private DateTime $startedAt;

    /**
     * @var DateTime|null
     */
    #[ORM\Column(name: 'finished_at', type: 'datetime', nullable: true)]
    private ?DateTime $finishedAt = null;

    /**
     * @var string
     */
    #[ORM\Column(name: 'command', type: 'string', length: 255, nullable: false)]
    private string $command;

    /**
     * @var array<string,string>|null
     */
    #[ORM\Column(name: 'input', type: 'json', nullable: true)]
    private ?array $input = null;

    /**
     * @var int
     */
    #[ORM\Column(name: 'status', type: 'integer')]
    private int $status;

    /**
     * @param int $id
     */
    public function setId(int $id): void
    {
        $this->id = $id;
    }

    /**
     * @param DateTime $startedAt
     */
    public function setStartedAt(DateTime $startedAt): void
    {
        $this->startedAt = $startedAt;
    }

    /**
     * @param DateTime|null $finishedAt
     */
    public function setFinishedAt(?DateTime $finishedAt): void
    {
        $this->finishedAt = $finishedAt;
    }

    /**
     * @param string $command
     */
    public function setCommand(string $command): void
    {
        $this->command = $command;
    }

    /**
     * @param array<string,string>|null $input
     */
    public function setInput(?array $input): void
    {
        $this->input = $input;
    }

    /**
     * @param int $status
     */
    public function setStatus(int $status): void
    {
        $this->status = $status;
    }
}
