<?php

namespace Optimust\Core\Traits;

use Optimust\Framework\Event\EventDispatcher;
use Optimust\Framework\Services;

trait EventDispatcherTrait
{
    use ServiceContainerTrait {
        getContainer as getServiceContainer;
    }

    /**
     * @return EventDispatcher
     */
    public function getEventDispatcher(): EventDispatcher
    {
        return $this->getServiceContainer()->get(Services::EVENT_DISPATCHER);
    }
}
