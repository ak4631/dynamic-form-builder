<?php

namespace Optimust\Entity;

use Doctrine\ORM\Mapping as ORM;
use Optimust\Entity\UserRole;

#[ORM\Entity]
#[ORM\Table(name: 'home_page')]
class HomePage
{
    /**
     * @var int
     */
    #[ORM\Column(name: 'id', type: 'integer')]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private int $id;

    /**
     * @var string|null
     */
    #[ORM\Column(name: 'action', type: 'string', length: 255, nullable: true)]
    private ?string $action = null;

    /**
     * @var string|null
     */
    #[ORM\Column(name: 'enable_class', type: 'string', length: 100, nullable: true)]
    private ?string $enableClass = null;

    /**
     * @var int
     */
    #[ORM\Column(name: 'priority', type: 'integer', options: ['default' => 0])]
    private int $priority;

    /**
     * @var UserRole
     */
    #[ORM\ManyToOne(targetEntity: UserRole::class)]
    #[ORM\JoinColumn(name: 'user_role_id', referencedColumnName: 'id')]
    private UserRole $userRole;

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
     * @return string|null
     */
    public function getAction(): ?string
    {
        return $this->action;
    }

    /**
     * @param string|null $action
     */
    public function setAction(?string $action): void
    {
        $this->action = $action;
    }

    /**
     * @return string|null
     */
    public function getEnableClass(): ?string
    {
        return $this->enableClass;
    }

    /**
     * @param string|null $enableClass
     */
    public function setEnableClass(?string $enableClass): void
    {
        $this->enableClass = $enableClass;
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

    /**
     * @return UserRole
     */
    public function getUserRole(): UserRole
    {
        return $this->userRole;
    }

    /**
     * @param UserRole $userRole
     */
    public function setUserRole(UserRole $userRole): void
    {
        $this->userRole = $userRole;
    }
}
