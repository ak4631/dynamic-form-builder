<?php

namespace Optimust\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'registration_event_queue')]
class RegistrationEventQueue
{
    public const INSTALLATION_START = 0;
    public const INSTALLATION_SUCCESS = 3;
    public const UPGRADE_START = 4;

    public const PUBLISH_EVENT_BATCH_SIZE = 5;

    /**
     * @var int
     */
    #[ORM\Column(name: 'id', type: 'integer')]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private int $id;

    /**
     * @var int
     */
    #[ORM\Column(name: 'event_type', type: 'integer')]
    private int $eventType;

    /**
     * @var bool
     */
    #[ORM\Column(name: 'published', type: 'boolean', nullable: false)]
    private bool $published;

    /**
     * @var DateTime|null
     */
    #[ORM\Column(name: 'event_time', type: 'datetime', nullable: true)]
    private ?DateTime $eventTime = null;

    /**
     * @var DateTime|null
     */
    #[ORM\Column(name: 'publish_time', type: 'datetime', nullable: true)]
    private ?DateTime $publishTime = null;

    /**
     * @var array|null
     */
    #[ORM\Column(name: 'data', type: 'json', nullable: true)]
    private ?array $data = [];

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
     * @return int
     */
    public function getEventType(): int
    {
        return $this->eventType;
    }

    /**
     * @param int $eventType
     */
    public function setEventType(int $eventType): void
    {
        $this->eventType = $eventType;
    }

    /**
     * @return bool
     */
    public function isPublished(): bool
    {
        return $this->published;
    }

    /**
     * @param bool $published
     */
    public function setPublished(bool $published): void
    {
        $this->published = $published;
    }

    /**
     * @return DateTime|null
     */
    public function getEventTime(): ?DateTime
    {
        return $this->eventTime;
    }

    /**
     * @param DateTime|null $eventTime
     */
    public function setEventTime(?DateTime $eventTime): void
    {
        $this->eventTime = $eventTime;
    }

    /**
     * @return DateTime|null
     */
    public function getPublishTime(): ?DateTime
    {
        return $this->publishTime;
    }

    /**
     * @param DateTime|null $publishTime
     */
    public function setPublishTime(?DateTime $publishTime): void
    {
        $this->publishTime = $publishTime;
    }

    /**
     * @return array|null
     */
    public function getData(): ?array
    {
        return $this->data;
    }

    /**
     * @param array|null $data
     */
    public function setData(?array $data): void
    {
        $this->data = $data;
    }
}
