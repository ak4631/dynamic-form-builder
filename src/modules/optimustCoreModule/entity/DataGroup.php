<?php

namespace Optimust\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Optimust\Entity\DataGroupPermission;
use Optimust\Entity\ApiPermission;

#[ORM\Entity]
#[ORM\Table(name: 'data_group')]
class DataGroup
{
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
    #[ORM\Column(name: 'name', type: 'string', length: 255)]
    private string $name;

    /**
     * @var string|null
     */
    #[ORM\Column(name: 'description', type: 'string', length: 255, nullable: true)]
    private ?string $description;

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
     * @var DataGroupPermission[]|Collection
     */
    #[ORM\OneToMany(targetEntity: DataGroupPermission::class, mappedBy: 'dataGroup')]
    private $dataGroupPermissions;

    /**
     * @var ApiPermission[]|Collection
     */
    #[ORM\OneToMany(targetEntity: ApiPermission::class, mappedBy: 'dataGroup')]
    private $apiPermissions;

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
     * @return string|null
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @param string|null $description
     */
    public function setDescription(?string $description): void
    {
        $this->description = $description;
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
}
