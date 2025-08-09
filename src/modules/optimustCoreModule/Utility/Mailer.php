<?php

namespace Optimust\Core\Utility;

use Symfony\Component\Mailer\Transport\TransportInterface;
use Symfony\Component\Mime\RawMessage;
use Symfony\Component\Mailer\Envelope;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mailer\Mailer as SymfonyMailer;

class Mailer implements MailerInterface
{
    /**
     * @var SymfonyMailer
     */
    private SymfonyMailer $mailer;

    /**
     * Mailer constructor.
     * @param TransportInterface $transport
     */
    public function __construct(TransportInterface $transport)
    {
        $this->mailer = new SymfonyMailer($transport);
    }

    /**
     * @param RawMessage $message
     * @param Envelope|null $envelope
     */
    public function send(RawMessage $message, Envelope $envelope = null): void
    {
        $this->mailer->send($message, $envelope);
    }
}
