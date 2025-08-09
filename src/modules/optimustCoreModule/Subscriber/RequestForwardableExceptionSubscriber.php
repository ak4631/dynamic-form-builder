<?php

namespace Optimust\Core\Subscriber;

use Optimust\Core\Controller\Exception\RequestForwardableException;
use Optimust\Core\Traits\ControllerTrait;
use Optimust\Framework\Event\AbstractEventSubscriber;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RequestForwardableExceptionSubscriber extends AbstractEventSubscriber
{
    use ControllerTrait;

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => [
                ['onExceptionEvent', 0],
            ],
        ];
    }

    /**
     * @param ExceptionEvent $event
     */
    public function onExceptionEvent(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();
        if ($exception instanceof RequestForwardableException) {
            $response = $this->forward(
                $exception->getController(),
                $exception->getAttributes(),
                $exception->getQuery()
            );
            $event->setResponse($response);
            $event->stopPropagation();
        }
    }
}
