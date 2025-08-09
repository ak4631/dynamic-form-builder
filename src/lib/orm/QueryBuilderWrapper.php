<?php

namespace Optimust\ORM;

use Doctrine\ORM\QueryBuilder;

class QueryBuilderWrapper
{
    private QueryBuilder $qb;

    /**
     * @param QueryBuilder $qb
     */
    public function __construct(QueryBuilder $qb)
    {
        $this->qb = $qb;
    }

    /**
     * @return QueryBuilder
     */
    public function getQueryBuilder(): QueryBuilder
    {
        return $this->qb;
    }
}
