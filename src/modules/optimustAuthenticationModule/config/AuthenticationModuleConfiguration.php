<?php

use Optimust\Authentication\Auth\AuthProviderChain;
use Optimust\Authentication\Auth\LocalAuthProvider;
use Optimust\Authentication\Auth\User as AuthUser;
use Optimust\Authentication\Csrf\CsrfTokenManager;
use Optimust\Authentication\Service\PasswordStrengthService;
use Optimust\Authentication\Subscriber\AdministratorAccessSubscriber;
use Optimust\Authentication\Subscriber\AuthenticationSubscriber;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Event\EventDispatcher;
use Optimust\Framework\Http\Request;
use Optimust\Framework\ModuleConfigurationInterface;
use Optimust\Framework\Services;
use Symfony\Component\Security\Csrf\TokenStorage\NativeSessionTokenStorage;

class AuthenticationModuleConfiguration implements ModuleConfigurationInterface
{
    use ServiceContainerTrait;

    /**
     * @inheritDoc
     */
    public function initialize(Request $request): void
    {
        /** @var EventDispatcher $dispatcher */
        $dispatcher = $this->getContainer()->get(Services::EVENT_DISPATCHER);
        $dispatcher->addSubscriber(new AuthenticationSubscriber());
        $dispatcher->addSubscriber(new AdministratorAccessSubscriber());
        $this->getContainer()->register(Services::AUTH_USER)
            ->setFactory([AuthUser::class, 'getInstance']);

        $this->getContainer()->register(Services::CSRF_TOKEN_STORAGE, NativeSessionTokenStorage::class);
        $this->getContainer()->register(Services::CSRF_TOKEN_MANAGER, CsrfTokenManager::class);
        /** @var AuthProviderChain $authProviderChain */
        $authProviderChain = $this->getContainer()->get(Services::AUTH_PROVIDER_CHAIN);
        $authProviderChain->addProvider(new LocalAuthProvider());

        $this->getContainer()->register(Services::PASSWORD_STRENGTH_SERVICE, PasswordStrengthService::class);
    }
}
