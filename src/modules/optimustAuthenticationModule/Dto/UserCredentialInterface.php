<?php

namespace Optimust\Authentication\Dto;

interface UserCredentialInterface
{
    /**
     * @return string|null
     */
    public function getUsername(): ?string;

    /**
     * @return string|null
     */
    public function getPassword(): ?string;
}
