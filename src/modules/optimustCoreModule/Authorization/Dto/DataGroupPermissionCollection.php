<?php

namespace Optimust\Core\Authorization\Dto;

use Optimust\Core\Dto\AttributeBag;

/**
 * @method ResourcePermission get(string $key, $default = null)
 * @method set(string $key, ResourcePermission $value)
 */
class DataGroupPermissionCollection extends AttributeBag
{
    /**
     * @return array<int, array{canRead: bool, canCreate: bool, canUpdate: bool, canDelete: bool}>
     */
    public function toArray(): array
    {
        $permissionsArray = [];
        /** @var array<string, ResourcePermission> $permissions */
        $permissions = $this->all();
        foreach ($permissions as $dataGroup => $permission) {
            $permissionsArray[$dataGroup] = [
                'canRead' => $permission->canRead(),
                'canCreate' => $permission->canCreate(),
                'canUpdate' => $permission->canUpdate(),
                'canDelete' => $permission->canDelete(),
            ];
        }
        return $permissionsArray;
    }
}
