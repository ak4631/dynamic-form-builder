<?php

namespace Optimust\Framework\Http\Session;

use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Session\SessionBagInterface;
use Symfony\Component\HttpFoundation\Session\Storage\MetadataBag;
use Symfony\Component\HttpFoundation\Session\Storage\SessionStorageInterface;

class MemorySessionStorage implements SessionStorageInterface
{
    /**
     * @var SessionBagInterface[]
     */
    protected array $bags = [];

    /**
     * @var MetadataBag
     */
    protected MetadataBag $metadataBag;

    public function __construct()
    {
        $this->metadataBag = new MetadataBag();
    }

    /**
     * @inheritDoc
     */
    public function start(): bool
    {
        return true;
    }

    /**
     * @inheritDoc
     */
    public function isStarted(): bool
    {
        return true;
    }

    /**
     * @inheritDoc
     */
    public function getId(): string
    {
        return '';
    }

    /**
     * @inheritDoc
     */
    public function setId(string $id): void
    {
    }

    /**
     * @inheritDoc
     */
    public function getName(): string
    {
        return 'SESSID';
    }

    /**
     * @inheritDoc
     */
    public function setName(string $name): void
    {
    }

    /**
     * @inheritDoc
     */
    public function regenerate(bool $destroy = false, int $lifetime = null): bool
    {
        if ($destroy) {
            $this->metadataBag->stampNew();
        }
        return true;
    }

    /**
     * @inheritDoc
     */
    public function save(): void
    {
    }

    /**
     * @inheritDoc
     */
    public function clear(): void
    {
        foreach ($this->bags as $bag) {
            $bag->clear();
        }
    }

    /**
     * @inheritDoc
     */
    public function getBag(string $name): SessionBagInterface
    {
        if (!isset($this->bags[$name])) {
            throw new InvalidArgumentException(sprintf('The SessionBagInterface "%s" is not registered.', $name));
        }

        return $this->bags[$name];
    }

    /**
     * @inheritDoc
     */
    public function registerBag(SessionBagInterface $bag): void
    {
        $this->bags[$bag->getName()] = $bag;
    }

    /**
     * @inheritDoc
     */
    public function getMetadataBag(): MetadataBag
    {
        return $this->metadataBag;
    }
}
