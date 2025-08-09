<?php

namespace Optimust\Authentication\Csrf;

use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Services;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManager as BaseCsrfTokenManager;
use Symfony\Component\Security\Csrf\TokenStorage\TokenStorageInterface;

class CsrfTokenManager extends BaseCsrfTokenManager
{
    use ServiceContainerTrait;

    public function __construct()
    {
        /** @var TokenStorageInterface $storage */
        $storage = $this->getContainer()->get(Services::CSRF_TOKEN_STORAGE);
        parent::__construct(new TokenGenerator(), $storage);
    }

    /**
     * @param string $id
     * @param string|null $value
     * @return bool
     */
    public function isValid(string $id, ?string $value): bool
    {
        return $this->isTokenValid(new CsrfToken($id, $value));
    }
}
