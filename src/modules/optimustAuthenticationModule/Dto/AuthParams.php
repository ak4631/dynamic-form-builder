<?php

namespace Optimust\Authentication\Dto;

class AuthParams implements AuthParamsInterface
{
    private ?UserCredentialInterface $credential;
    private ?AuthAttributeBagInterface $attributeBag;

    /**
     * @param UserCredentialInterface|null $credential
     * @param AuthAttributeBagInterface|null $attributeBag
     */
    public function __construct(?UserCredentialInterface $credential, ?AuthAttributeBagInterface $attributeBag = null)
    {
        $this->credential = $credential;
        $this->attributeBag = $attributeBag;
    }

    /**
     * @inheritDoc
     */
    public function getCredential(): ?UserCredentialInterface
    {
        return clone $this->credential;
    }

    /**
     * @inheritDoc
     */
    public function getAttributeBag(): ?AuthAttributeBagInterface
    {
        return clone $this->attributeBag;
    }
}
