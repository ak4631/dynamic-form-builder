<?php

namespace Optimust\Core\Authorization\Dao;

use Exception;
use Optimust\Core\Dao\BaseDao;
use Optimust\Core\Exception\DaoException;
use Optimust\Entity\ScreenPermission;
use Optimust\Entity\UserRole;

class ScreenPermissionDao extends BaseDao
{
    /**
     * @param string $module Module Name
     * @param string $actionUrl Action
     * @param string[]|UserRole[] $roles Array of UserRole objects or user role names
     * @return ScreenPermission[]
     * @throws DaoException
     */
    public function getScreenPermissions(string $module, string $actionUrl, array $roles): array
    {
        try {
            $roleNames = [];

            foreach ($roles as $role) {
                if ($role instanceof UserRole) {
                    $roleNames[] = $role->getName();
                } elseif (is_string($role)) {
                    $roleNames[] = $role;
                }
            }

            $q = $this->createQueryBuilder(ScreenPermission::class, 'sp');
            $q->leftJoin('sp.userRole', 'ur');
            $q->leftJoin('sp.screen', 's');
            $q->leftJoin('s.module', 'm');
            $q->andWhere('m.name = :moduleName')
                ->setParameter('moduleName', $module);
            $q->andWhere('s.actionUrl = :actionUrl')
                ->setParameter('actionUrl', $actionUrl);
            $q->andWhere($q->expr()->in('ur.name', ':userRoleNames'))
                ->setParameter('userRoleNames', $roleNames);

            return $q->getQuery()->execute();
        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }
}
