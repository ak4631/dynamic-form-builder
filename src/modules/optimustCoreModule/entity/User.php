<?php

namespace Optimust\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Optimust\Entity\Decorator\DecoratorTrait;
use Optimust\Entity\Decorator\UserDecorator;
use Optimust\Entity\UserRole;
use Optimust\Entity\UserAuthProvider;

/**
 * @method UserDecorator getDecorator()
 */
#[ORM\Entity]
#[ORM\Table(name: 'user')]
class User
{
    use DecoratorTrait;

    /**
     * @var int
     */
    #[ORM\Column(name: 'id', type: 'integer')]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private int $id;

    /**
     * @var string
     */
    #[ORM\Column(name: 'user_name', type: 'string', length: 40)]
    private string $userName;

    /**
     * @var string|null
     */
    #[ORM\Column(name: 'user_password', type: 'string', length: 255, nullable: true)]
    private ?string $userPassword = null;

    /**
     * @var bool
     */
    #[ORM\Column(name: 'deleted', type: 'boolean')]
    private bool $deleted;

    /**
     * @var bool
     */
    #[ORM\Column(name: 'status', type: 'boolean')]
    private bool $status;

    /**
     * @var DateTime|null
     */
    #[ORM\Column(name: 'date_entered', type: 'datetime', length: 25, nullable: true)]
    private ?DateTime $dateEntered = null;

    /**
     * @var DateTime|null
     */
    #[ORM\Column(name: 'date_modified', type: 'datetime', length: 25, nullable: true)]
    private ?DateTime $dateModified = null;

    /**
     * @var int|null
     */
    #[ORM\Column(name: 'modified_user_id', type: 'integer', nullable: true)]
    private ?int $modifiedUserId = null;

    /**
     * @var int|null
     */
    #[ORM\Column(name: 'created_by', type: 'integer', nullable: true)]
    private ?int $createdBy = null;

    /**
     * @var UserRole
     */
    #[ORM\ManyToOne(targetEntity: UserRole::class)]
    #[ORM\JoinColumn(name: 'user_role_id', referencedColumnName: 'id', nullable: false)]
    private UserRole $userRole;

    /**
     * @var UserAuthProvider[]
     */
    #[ORM\OneToMany(targetEntity: UserAuthProvider::class, mappedBy: 'user')]
    private iterable $authProviders;

    public function __construct()
    {
        $this->status = true;
        $this->deleted = false;
        $this->authProviders = new ArrayCollection();
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
    public function getUserName(): string
    {
        return $this->userName;
    }

    /**
     * @param string $userName
     */
    public function setUserName(string $userName): void
    {
        $this->userName = $userName;
    }

    /**
     * @return string|null
     */
    public function getUserPassword(): ?string
    {
        return $this->userPassword;
    }

    /**
     * @param string|null $userPassword
     */
    public function setUserPassword(?string $userPassword): void
    {
        $this->userPassword = $userPassword;
    }

    /**
     * @return bool
     */
    public function isDeleted(): bool
    {
        return $this->deleted;
    }

    /**
     * @param bool $deleted
     */
    public function setDeleted(bool $deleted): void
    {
        $this->deleted = $deleted;
    }

    /**
     * @return bool
     */
    public function getStatus(): bool
    {
        return $this->status;
    }

    /**
     * @param bool $status
     */
    public function setStatus(bool $status): void
    {
        $this->status = $status;
    }

    /**
     * @return DateTime|null
     */
    public function getDateEntered(): ?DateTime
    {
        return $this->dateEntered;
    }

    /**
     * @param DateTime|null $dateEntered
     */
    public function setDateEntered(?DateTime $dateEntered): void
    {
        $this->dateEntered = $dateEntered;
    }

    /**
     * @return DateTime|null
     */
    public function getDateModified(): ?DateTime
    {
        return $this->dateModified;
    }

    /**
     * @param DateTime|null $dateModified
     */
    public function setDateModified(?DateTime $dateModified): void
    {
        $this->dateModified = $dateModified;
    }

    /**
     * @return int|null
     */
    public function getModifiedUserId(): ?int
    {
        return $this->modifiedUserId;
    }

    /**
     * @param int|null $modifiedUserId
     */
    public function setModifiedUserId(?int $modifiedUserId): void
    {
        $this->modifiedUserId = $modifiedUserId;
    }

    /**
     * @return int|null
     */
    public function getCreatedBy(): ?int
    {
        return $this->createdBy;
    }

    /**
     * @param int|null $createdBy
     */
    public function setCreatedBy(?int $createdBy): void
    {
        $this->createdBy = $createdBy;
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

    /**
     * @return UserAuthProvider[]
     */
    public function getAuthProviders(): iterable
    {
        return $this->authProviders;
    }

    /**
     * @param UserAuthProvider[] $authProviders
     */
    public function setAuthProviders(array $authProviders): void
    {
        $this->authProviders = $authProviders;
    }
}
