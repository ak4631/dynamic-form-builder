<?php

namespace Optimust\Core\Traits\ORM;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ObjectRepository;
use Optimust\ORM\Paginator;
use Optimust\ORM\QueryBuilderWrapper;

trait EntityManagerHelperTrait
{
    use EntityManagerTrait;

    /**
     * @param string $entityClass
     * @return ObjectRepository|EntityRepository
     *
     * @template T
     * @psalm-param class-string<T> $entityClass
     * @psalm-return EntityRepository<T>
     */
    protected function getRepository(string $entityClass)
    {
        return $this->getEntityManager()->getRepository($entityClass);
    }

    /**
     * @param $entity
     */
    protected function persist($entity): void
    {
        $this->getEntityManager()->persist($entity);
        $this->getEntityManager()->flush();
    }

    /**
     * @param $entity
     */
    protected function remove($entity): void
    {
        $this->getEntityManager()->remove($entity);
        $this->getEntityManager()->flush();
    }

    /**
     * @param string $entityClass
     * @param string $alias
     * @param string|null $indexBy
     * @return QueryBuilder
     */
    protected function createQueryBuilder(string $entityClass, string $alias, ?string $indexBy = null): QueryBuilder
    {
        return $this->getEntityManager()->createQueryBuilder()
            ->select($alias)
            ->from($entityClass, $alias, $indexBy);
    }

    /**
     * @param QueryBuilder $qb
     * @return Paginator
     */
    protected function getPaginator(QueryBuilder $qb): Paginator
    {
        return new Paginator($qb);
    }

    /**
     * @param QueryBuilder $qb
     * @return QueryBuilderWrapper
     */
    protected function getQueryBuilderWrapper(QueryBuilder $qb): QueryBuilderWrapper
    {
        return new QueryBuilderWrapper($qb);
    }

    /**
     * @param QueryBuilder $qb
     * @param int $offset
     * @return object|null
     */
    protected function fetchOne(QueryBuilder $qb, int $offset = 0): ?object
    {
        $result = $qb->setFirstResult($offset)
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
        return $result[0] ?? null;
    }

    /**
     * @param string $entityName The name of the entity type.
     * @param mixed $id The entity identifier.
     * @return object|null The entity reference.
     *
     * @template T
     * @psalm-param class-string<T> $entityName
     * @psalm-return ?T
     */
    protected function getReference(string $entityName, $id)
    {
        return $this->getEntityManager()->getReference($entityName, $id);
    }

    /**
     * @return void
     */
    protected function beginTransaction(): void
    {
        $this->getEntityManager()->getConnection()->beginTransaction();
    }

    /**
     * @return void
     */
    protected function commitTransaction(): void
    {
        $this->getEntityManager()->getConnection()->commit();
    }

    /**
     * @return void
     */
    protected function rollBackTransaction(): void
    {
        $this->getEntityManager()->getConnection()->rollBack();
    }
}
