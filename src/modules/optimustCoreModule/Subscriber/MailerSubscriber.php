<?php

namespace Optimust\Core\Subscriber;

use Optimust\Authentication\Auth\User as AuthUser;
use Optimust\Core\Service\EmailQueueService;
use Optimust\Core\Traits\Auth\AuthUserTrait;
use Optimust\Core\Traits\LoggerTrait;
use Optimust\Core\Traits\ORM\EntityManagerHelperTrait;
use Optimust\Framework\Event\AbstractEventSubscriber;
use Symfony\Component\HttpKernel\Event\TerminateEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class MailerSubscriber extends AbstractEventSubscriber
{
    use LoggerTrait;
    use AuthUserTrait;
    use EntityManagerHelperTrait;

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::TERMINATE => [
                ['onTerminateEvent', 0],
            ],
        ];
    }

    /**
     * @param TerminateEvent $event
     */
    public function onTerminateEvent(TerminateEvent $event): void
    {
        if ($this->getAuthUser()->hasFlash(AuthUser::FLASH_SEND_EMAIL_FLAG)) {
            $this->getAuthUser()->getFlash(AuthUser::FLASH_SEND_EMAIL_FLAG);
            $timeStart = microtime(true);
            $this->getLogger()->info("MailerSubscriber >> Start: $timeStart");

            $emailQueueService = new EmailQueueService();
            $emailQueueService->sendAllPendingMails();

            $timeEnd = microtime(true);
            $executionTime = ($timeEnd - $timeStart);
            $this->getLogger()->info("MailerSubscriber >> End: $timeEnd");
            $this->getLogger()->info("MailerSubscriber >> Execution time: $executionTime");
        }
    }
}
