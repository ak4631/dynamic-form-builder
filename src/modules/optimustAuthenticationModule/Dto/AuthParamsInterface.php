<?php

namespace Optimust\Authentication\Dto;

interface AuthParamsInterface
{
    /**
     * @return UserCredentialInterface|null
     */
    public function getCredential(): ?UserCredentialInterface;

    /**
     * @return AuthAttributeBagInterface|null
     */
    public function getAttributeBag(): ?AuthAttributeBagInterface;
}
