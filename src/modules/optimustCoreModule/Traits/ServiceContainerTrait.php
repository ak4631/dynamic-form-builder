<?php

namespace Optimust\Core\Traits;

use Optimust\Framework\DependencyInjection\ContainerBuilder;
use Optimust\Framework\ServiceContainer;

trait ServiceContainerTrait
{
    /**
     * @return ContainerBuilder
     */
    protected function getContainer(): ContainerBuilder
    {
        return ServiceContainer::getContainer();
    }
}
