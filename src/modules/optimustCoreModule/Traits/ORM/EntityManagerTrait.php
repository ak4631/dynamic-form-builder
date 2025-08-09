<?php

namespace Optimust\Core\Traits\ORM;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Optimust\Framework\ServiceContainer;
use Optimust\Framework\Services;

trait EntityManagerTrait
{
    /**
     * @return EntityManager|EntityManagerInterface
     */
    protected function getEntityManager(): EntityManagerInterface
    {
        return ServiceContainer::getContainer()->get(Services::DOCTRINE);
    }
}
