<?php

namespace Optimust\Core\Utility;

use Optimust\Entity\Mail;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;

class MailMessage extends Email
{
    /**
     * @var string
     */
    private string $contentType;

    /**
     * @param string $contentType
     */
    public function __construct(string $contentType = Mail::CONTENT_TYPE_TEXT_HTML)
    {
        $this->contentType = $contentType;
        parent::__construct();
    }

    /**
     * @param string $subject
     * @return $this
     */
    public function setSubject(string $subject): MailMessage
    {
        return $this->subject($subject);
    }

    /**
     * @param string[] $addresses
     * @return $this
     */
    public function setFrom(array $addresses): MailMessage
    {
        $symfonyAddresses = [];
        foreach ($addresses as $address => $name) {
            $symfonyAddresses[] = new Address($address, $name);
        }

        return $this->from(...$symfonyAddresses);
    }

    /**
     * @param string[] $addresses
     * @return $this
     */
    public function setTo(array $addresses): MailMessage
    {
        return $this->to(...$addresses);
    }

    /**
     * @param string $body
     * @return $this
     */
    public function setMailBody(string $body): MailMessage
    {
        if ($this->contentType === Mail::CONTENT_TYPE_TEXT_PLAIN) {
            return $this->text($body);
        } else {
            return $this->html($body);
        }
    }

    /**
     * @param string[] $addresses
     * @return $this
     */
    public function setCc(array $addresses): MailMessage
    {
        return $this->cc(...$addresses);
    }

    /**
     * @param string[] $addresses
     * @return $this
     */
    public function setBcc(array $addresses): MailMessage
    {
        return $this->bcc(...$addresses);
    }
}
