<?php

namespace Optimust\ORM;

use Doctrine\ORM\AbstractQuery;
use Doctrine\DBAL\Result;
use Exception;

final class DoctrineQuery extends AbstractQuery
{
    public function getSQL(): string|array
    {
        throw new Exception('Not implement');
    }

    protected function _doExecute(): Result|int
    {
        throw new Exception('Not implement');
    }
}
