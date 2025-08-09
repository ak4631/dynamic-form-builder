<?php

namespace Optimust\Core\Dao;

use Optimust\Entity\UniqueId;

/**
 * @group Core
 * @group Dao
 */
class IDGeneratorDao extends BaseDao
{
    /**
     * @param string $entityClass
     * @return int
     */
    public function getCurrentID(string $entityClass): int
    {
        $q = $this->createQueryBuilder(UniqueId::class, 'u');
        $q->where('u.tableName = :tableName')
            ->setParameter('tableName', $this->getTableName($entityClass));

        $uniqueId = $q->getQuery()->getOneOrNullResult();
        if ($uniqueId instanceof UniqueId) {
            return $uniqueId->getLastId();
        } else {
            return 0;
        }
    }

    /**
     * @param string $entityClass
     * @param int $nextId
     * @return int
     */
    public function updateNextId(string $entityClass, int $nextId): int
    {
        $q = $this->createQueryBuilder(UniqueId::class, 'u');
        $q->update()
            ->set('u.lastId', ':lastId')
            ->setParameter('lastId', $nextId);
        $q->where('u.tableName = :tableName')
            ->setParameter('tableName', $this->getTableName($entityClass));
        return $q->getQuery()->execute();
    }

    /**
     * @param string $entityClass
     * @return string
     */
    private function getTableName(string $entityClass): string
    {
        return $this->getEntityManager()->getClassMetadata($entityClass)->getTableName();
    }
}
