<?php

namespace Optimust\Core\Authorization\Dao;

use Optimust\Core\Dao\BaseDao;
use Optimust\Entity\Screen;

class ScreenDao extends BaseDao
{
    /**
     * Get screen for given module and action
     *
     * @param string $module Module Name
     * @param string $action
     * @return Screen|null
     */
    public function getScreen(string $module, string $action): ?Screen
    {
        $q = $this->createQueryBuilder(Screen::class, 's');
        $q->leftJoin('s.module', 'm');
        $q->andWhere('m.name = :moduleName')
            ->setParameter('moduleName', $module);
        $q->andWhere('s.actionUrl = :actionUrl')
            ->setParameter('actionUrl', $action);

        return $q->getQuery()->getOneOrNullResult();
    }
}
