<?php

namespace Optimust\Core\Subscriber;

use Exception;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Event\AbstractEventSubscriber;
use Optimust\Framework\Logger\Logger;
use Optimust\Framework\Services;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class LoggerSubscriber extends AbstractEventSubscriber
{
    use ServiceContainerTrait;

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => [
                ['onExceptionEvent', 100000],
            ],
        ];
    }

    /**
     * @param ExceptionEvent $event
     * @throws Exception
     */
    public function onExceptionEvent(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();
        /** @var Logger $logger */
        $logger = $this->getContainer()->get(Services::LOGGER);
        $logger->error($exception->getMessage());
        $logger->error($exception->getTraceAsString());
    }
}
