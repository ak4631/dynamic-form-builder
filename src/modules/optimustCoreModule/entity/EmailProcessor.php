<?php

namespace Optimust\Entity;

use Doctrine\ORM\Mapping as ORM;
use Optimust\Entity\Email;

#[ORM\Entity]
#[ORM\Table(name: 'email_processor')]
class EmailProcessor
{
    /**
     * @var int
     */
    #[ORM\Column(name: 'id', type: 'integer', length: 6)]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private int $id;

    /**
     * @var Email
     */
    #[ORM\ManyToOne(targetEntity: Email::class, inversedBy: 'emailProcessors')]
    #[ORM\JoinColumn(name: 'email_id', referencedColumnName: 'id')]
    private Email $email;

    /**
     * @var string|null
     */
    #[ORM\Column(name: 'class_name', type: 'string', length: 100, nullable: true)]
    private ?string $className = null;

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
     * @return Email
     */
    public function getEmail(): Email
    {
        return $this->email;
    }

    /**
     * @param Email $email
     */
    public function setEmail(Email $email): void
    {
        $this->email = $email;
    }

    /**
     * @return string|null
     */
    public function getClassName(): ?string
    {
        return $this->className;
    }

    /**
     * @param string|null $className
     */
    public function setClassName(?string $className): void
    {
        $this->className = $className;
    }
}
