<?php

namespace Optimust\Core\Authorization\Dto;

use Optimust\Entity\DataGroupPermission;

class ResourcePermission
{
    /**
     * @var bool
     */
    private bool $canRead;

    /**
     * @var bool
     */
    private bool $canCreate;

    /**
     * @var bool
     */
    private bool $canUpdate;

    /**
     * @var bool
     */
    private bool $canDelete;

    /**
     * @param bool $canRead
     * @param bool $canCreate
     * @param bool $canUpdate
     * @param bool $canDelete
     */
    public function __construct(bool $canRead, bool $canCreate, bool $canUpdate, bool $canDelete)
    {
        $this->canRead = $canRead;
        $this->canCreate = $canCreate;
        $this->canUpdate = $canUpdate;
        $this->canDelete = $canDelete;
    }

    /**
     * @return bool
     */
    public function canRead(): bool
    {
        return $this->canRead;
    }

    /**
     * @return bool
     */
    public function canCreate(): bool
    {
        return $this->canCreate;
    }

    /**
     * @return bool
     */
    public function canUpdate(): bool
    {
        return $this->canUpdate;
    }

    /**
     * @return bool
     */
    public function canDelete(): bool
    {
        return $this->canDelete;
    }

    /**
     * @param ResourcePermission $permission
     * @return self
     */
    public function andWith(ResourcePermission $permission): self
    {
        return new ResourcePermission(
            $this->canRead() && $permission->canRead(),
            $this->canCreate() && $permission->canCreate(),
            $this->canUpdate() && $permission->canUpdate(),
            $this->canDelete() && $permission->canDelete()
        );
    }

    /**
     * @param ResourcePermission $permission
     * @return self
     */
    public function orWith(ResourcePermission $permission): self
    {
        return new ResourcePermission(
            $this->canRead() || $permission->canRead(),
            $this->canCreate() || $permission->canCreate(),
            $this->canUpdate() || $permission->canUpdate(),
            $this->canDelete() || $permission->canDelete()
        );
    }

    /**
     * @param array $permissions
     * @param bool $default
     * @return self
     */
    public static function fromArray(array $permissions, bool $default = false): self
    {
        $canRead = $permissions['canRead'] ?? $default;
        $canCreate = $permissions['canCreate'] ?? $default;
        $canUpdate = $permissions['canUpdate'] ?? $default;
        $canDelete = $permissions['canDelete'] ?? $default;
        return new self($canRead, $canCreate, $canUpdate, $canDelete);
    }

    /**
     * @param DataGroupPermission $dataGroupPermission
     * @return self
     */
    public static function createFromDataGroupPermission(DataGroupPermission $dataGroupPermission): self
    {
        return new self(
            $dataGroupPermission->canRead(),
            $dataGroupPermission->canCreate(),
            $dataGroupPermission->canUpdate(),
            $dataGroupPermission->canDelete()
        );
    }
}
