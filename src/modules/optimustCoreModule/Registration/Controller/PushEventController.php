<?php

namespace Optimust\Core\Registration\Controller;

use Optimust\Core\Controller\AbstractController;
use Optimust\Core\Registration\Processor\RegistrationEventProcessorFactory;
use Optimust\Core\Traits\CacheTrait;
use Optimust\Framework\Http\Response;
use Throwable;

class PushEventController extends AbstractController
{
    use CacheTrait;

    /**
     * @return Response
     */
    public function handle(): Response
    {
        $cacheItem = $this->getCache()->getItem('core.registration.event.pushed');
        if ($cacheItem->isHit()) {
            return $this->getResponse();
        }

        try {
            $registrationEventProcessorFactory = new RegistrationEventProcessorFactory();
            $registrationEventProcessor = $registrationEventProcessorFactory->getRegistrationEventProcessor(
                1
            );
            $registrationEventProcessor->publishRegistrationEvents();
        } catch (Throwable $e) {
        }

        $cacheItem->expiresAfter(3600);
        $cacheItem->set(true);
        $this->getCache()->save($cacheItem);
        return $this->getResponse();
    }
}
