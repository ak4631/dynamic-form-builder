<?php

namespace Optimust\Entity;

use Doctrine\ORM\Mapping as ORM;
use Optimust\Entity\DataGroup;
use Optimust\Entity\UserRole;

#[ORM\Entity]
#[ORM\Table(name: 'user_role_data_group')]
class DataGroupPermission
{
    /**
     * @var int
     */
    #[ORM\Column(name: 'id', type: 'integer')]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private int $id;

    /**
     * @var bool|null
     */
    #[ORM\Column(name: 'can_read', type: 'boolean', nullable: true)]
    private ?bool $canRead = null;

    /**
     * @var bool|null
     */
    #[ORM\Column(name: 'can_create', type: 'boolean', nullable: true)]
    private ?bool $canCreate = null;

    /**
     * @var bool|null
     */
    #[ORM\Column(name: 'can_update', type: 'boolean', nullable: true)]
    private ?bool $canUpdate = null;

    /**
     * @var bool|null
     */
    #[ORM\Column(name: 'can_delete', type: 'boolean', nullable: true)]
    private ?bool $canDelete = null;

    /**
     * @var bool|null
     */
    #[ORM\Column(name: 'self', type: 'boolean', nullable: true)]
    private ?bool $self = null;

    /**
     * @var DataGroup
     */
    #[ORM\ManyToOne(targetEntity: DataGroup::class, inversedBy: 'dataGroupPermissions')]
    #[ORM\JoinColumn(name: 'data_group_id', referencedColumnName: 'id')]
    private DataGroup $dataGroup;

    /**
     * @var UserRole
     */
    #[ORM\ManyToOne(targetEntity: UserRole::class, cascade: ['persist'])]
    #[ORM\JoinColumn(name: 'user_role_id', referencedColumnName: 'id')]
    private UserRole $userRole;

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
     * @return bool
     */
    public function canRead(): bool
    {
        return (bool)$this->canRead;
    }

    /**
     * @param bool $canRead
     */
    public function setCanRead(bool $canRead): void
    {
        $this->canRead = $canRead;
    }

    /**
     * @return bool
     */
    public function canCreate(): bool
    {
        return (bool)$this->canCreate;
    }

    /**
     * @param bool $canCreate
     */
    public function setCanCreate(bool $canCreate): void
    {
        $this->canCreate = $canCreate;
    }

    /**
     * @return bool
     */
    public function canUpdate(): bool
    {
        return (bool)$this->canUpdate;
    }

    /**
     * @param bool $canUpdate
     */
    public function setCanUpdate(bool $canUpdate): void
    {
        $this->canUpdate = $canUpdate;
    }

    /**
     * @return bool
     */
    public function canDelete(): bool
    {
        return (bool)$this->canDelete;
    }

    /**
     * @param bool $canDelete
     */
    public function setCanDelete(bool $canDelete): void
    {
        $this->canDelete = $canDelete;
    }

    /**
     * @return bool
     */
    public function isSelf(): bool
    {
        return (bool)$this->self;
    }

    /**
     * @param bool $self
     */
    public function setSelf(bool $self): void
    {
        $this->self = $self;
    }

    /**
     * @return DataGroup
     */
    public function getDataGroup(): DataGroup
    {
        return $this->dataGroup;
    }

    /**
     * @param DataGroup $dataGroup
     */
    public function setDataGroup(DataGroup $dataGroup): void
    {
        $this->dataGroup = $dataGroup;
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
