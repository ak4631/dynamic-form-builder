<?php

namespace Optimust\Core\Authorization\Dao;

use Exception;
use Optimust\Core\Dao\BaseDao;
use Optimust\Core\Exception\DaoException;
use Optimust\Entity\HomePage;
use Optimust\Entity\ModuleDefaultPage;
use Optimust\ORM\ListSorter;

class HomePageDao extends BaseDao
{
    /**
     * Get home page records for the given user role ids in priority order. (Descending order of the priority field).
     * If two records have the same priority, the higher ID will be returned first. (Assuming the later entry was
     * intended to override the earlier entry).
     *
     * @param array $userRoleIds Array of user role ids
     * @return HomePage[] List of matching home page entries
     *
     * @throws DaoException on an error from the database layer
     */
    public function getHomePagesInPriorityOrder(array $userRoleIds): array
    {
        try {
            $q = $this->createQueryBuilder(HomePage::class, 'h');
            $q->leftJoin('h.userRole', 'ur');
            $q->andWhere($q->expr()->in('ur.id', ':userRoleIds'))
                ->setParameter('userRoleIds', $userRoleIds);
            $q->addOrderBy('h.priority', ListSorter::DESCENDING);
            $q->addOrderBy('h.id', ListSorter::DESCENDING);

            return $q->getQuery()->execute();
        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }

    /**
     * Get module default page records for the given module and given user role ids in priority order.
     * (Descending order of the priority field).
     * If two records have the same priority, the higher ID will be returned first. (Assuming the later entry was
     * intended to override the earlier entry).
     *
     * @param string $moduleName Module Name
     * @param array $userRoleIds Array of user role ids
     * @return ModuleDefaultPage[] List of matching default page entries
     *
     * @throws DaoException on an error from the database layer
     */
    public function getModuleDefaultPagesInPriorityOrder(string $moduleName, array $userRoleIds): array
    {
        try {
            $q = $this->createQueryBuilder(ModuleDefaultPage::class, 'p');
            $q->leftJoin('p.module', 'm');
            $q->leftJoin('p.userRole', 'ur');
            $q->andWhere($q->expr()->in('ur.id', ':userRoleIds'))
                ->setParameter('userRoleIds', $userRoleIds);
            $q->andWhere('m.name = :moduleName')
                ->setParameter('moduleName', $moduleName);
            $q->addOrderBy('m.name', ListSorter::DESCENDING);
            $q->addOrderBy('p.priority', ListSorter::DESCENDING);

            return $q->getQuery()->execute();
        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }
}
