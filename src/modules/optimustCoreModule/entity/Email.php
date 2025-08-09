<?php

namespace Optimust\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Optimust\Entity\EmailProcessor;

#[ORM\Entity]
#[ORM\Table(name: 'email')]
class Email
{
    /**
     * @var int
     */
    #[ORM\Column(name: 'id', type: 'integer', length: 6)]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private int $id;

    /**
     * @var string
     */
    #[ORM\Column(name: 'name', type: 'string', length: 100)]
    private string $name;

    /**
     * @var EmailProcessor[]
     */
    #[ORM\OneToMany(targetEntity: EmailProcessor::class, mappedBy: 'email')]
    private iterable $emailProcessors;

    public function __construct()
    {
        $this->emailProcessors = new ArrayCollection();
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
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return EmailProcessor[]
     */
    public function getEmailProcessors(): iterable
    {
        return $this->emailProcessors;
    }

    /**
     * @param EmailProcessor[] $emailProcessors
     */
    public function setEmailProcessors(iterable $emailProcessors): void
    {
        $this->emailProcessors = $emailProcessors;
    }
}
