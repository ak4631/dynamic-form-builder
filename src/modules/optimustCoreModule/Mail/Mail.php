<?php

namespace Optimust\Core\Mail;

interface Mail
{
    /**
     * @return string[]
     */
    public function getToList(): array;

    /**
     * @return string[]|null
     */
    public function getCcList(): ?array;

    /**
     * @return string[]|null
     */
    public function getBccList(): ?array;

    /**
     * @return string|null
     */
    public function getSubject(): ?string;

    /**
     * @return string|null
     */
    public function getBody(): ?string;

    /**
     * @return string|null
     */
    public function getContentType(): ?string;
}
