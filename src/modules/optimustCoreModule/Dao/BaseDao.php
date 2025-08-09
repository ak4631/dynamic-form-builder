<?php

namespace Optimust\Core\Dao;

use Doctrine\ORM\QueryBuilder;
use Optimust\Core\Dto\FilterParams;
use Optimust\Core\Traits\ORM\EntityManagerHelperTrait;

abstract class BaseDao
{
    use EntityManagerHelperTrait;

    /**
     * @param QueryBuilder $qb
     * @return int
     */
    protected function count(QueryBuilder $qb): int
    {
        return $this->getPaginator($qb)->count();
    }

    /**
     * @param QueryBuilder $qb
     * @param FilterParams $filterParams
     * @return QueryBuilder
     */
    protected function setSortingParams(QueryBuilder $qb, FilterParams $filterParams): QueryBuilder
    {
        if (!is_null($filterParams->getSortField())) {
            $qb->addOrderBy(
                $filterParams->getSortField(),
                $filterParams->getSortOrder()
            );
        }
        return $qb;
    }

    /**
     * @param QueryBuilder $qb
     * @param FilterParams $filterParams
     * @return QueryBuilder
     */
    protected function setPaginationParams(QueryBuilder $qb, FilterParams $filterParams): QueryBuilder
    {
        // If limit = 0, will not paginate
        if (!empty($filterParams->getLimit())) {
            $qb->setFirstResult($filterParams->getOffset())
                ->setMaxResults($filterParams->getLimit());
        }
        return $qb;
    }

    /**
     * @param QueryBuilder $qb
     * @param FilterParams $filterParams
     * @return QueryBuilder
     */
    protected function setSortingAndPaginationParams(QueryBuilder $qb, FilterParams $filterParams): QueryBuilder
    {
        $this->setSortingParams($qb, $filterParams);
        $this->setPaginationParams($qb, $filterParams);
        return $qb;
    }
}
