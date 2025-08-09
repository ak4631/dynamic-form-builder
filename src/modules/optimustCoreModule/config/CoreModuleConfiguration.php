<?php

use Optimust\Config\Config;
use Optimust\Core\Authorization\Helper\UserRoleManagerHelper;
use Optimust\Core\Authorization\Manager\UserRoleManagerFactory;
use Optimust\Core\Command\RunScheduleCommand;
use Optimust\Core\Helper\ClassHelper;
use Optimust\Core\Service\CacheService;
use Optimust\Core\Service\ConfigService;
use Optimust\Core\Service\DateTimeHelperService;
use Optimust\Core\Service\MenuService;
use Optimust\Core\Service\ModuleService;
use Optimust\Core\Service\NormalizerService;
use Optimust\Core\Service\NumberHelperService;
use Optimust\Core\Service\TextHelperService;
use Optimust\Core\Subscriber\ApiAuthorizationSubscriber;
use Optimust\Core\Subscriber\ExceptionSubscriber;
use Optimust\Core\Subscriber\GlobalConfigSubscriber;
use Optimust\Core\Subscriber\MailerSubscriber;
use Optimust\Core\Subscriber\ModuleNotAvailableSubscriber;
use Optimust\Core\Subscriber\RequestBodySubscriber;
use Optimust\Core\Subscriber\RequestForwardableExceptionSubscriber;
use Optimust\Core\Subscriber\ScreenAuthorizationSubscriber;
use Optimust\Core\Subscriber\SessionSubscriber;
use Optimust\Core\Traits\EventDispatcherTrait;
use Optimust\Core\Traits\Service\ConfigServiceTrait;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Console\Console;
use Optimust\Framework\Console\ConsoleConfigurationInterface;
use Optimust\Framework\Http\Request;
use Optimust\Framework\Http\Session\MemorySessionStorage;
use Optimust\Framework\Http\Session\NativeSessionStorage;
use Optimust\Framework\Http\Session\Session;
use Optimust\Framework\ModuleConfigurationInterface;
use Optimust\Framework\Services;
use Symfony\Component\HttpFoundation\Session\Storage\Handler\NativeFileSessionHandler;
use Symfony\Component\HttpFoundation\Session\Storage\SessionStorageInterface;
use Symfony\Component\HttpKernel\EventListener\SessionListener;
use Symfony\Component\HttpKernel\KernelEvents;

class CoreModuleConfiguration implements ModuleConfigurationInterface, ConsoleConfigurationInterface
{
    use ServiceContainerTrait;
    use EventDispatcherTrait;
    use ConfigServiceTrait;

    /**
     * @inheritDoc
     */
    public function initialize(Request $request): void
    {
        $sessionStorage = $this->getSessionStorage($request);
        $session = new Session($sessionStorage);
        $session->start();

        $this->getContainer()->set(Services::SESSION_STORAGE, $sessionStorage);
        $this->getContainer()->set(Services::SESSION, $session);
        $this->getContainer()->register(Services::CONFIG_SERVICE, ConfigService::class);
        $this->getContainer()->register(Services::NORMALIZER_SERVICE, NormalizerService::class);
        $this->getContainer()->register(Services::DATETIME_HELPER_SERVICE, DateTimeHelperService::class);
        $this->getContainer()->register(Services::TEXT_HELPER_SERVICE, TextHelperService::class);
        $this->getContainer()->register(Services::NUMBER_HELPER_SERVICE, NumberHelperService::class);
        $this->getContainer()->register(Services::CLASS_HELPER, ClassHelper::class);
        $this->getContainer()->register(Services::USER_ROLE_MANAGER)
            ->setFactory([UserRoleManagerFactory::class, 'getUserRoleManager']);
        $this->getContainer()->register(Services::USER_ROLE_MANAGER_HELPER, UserRoleManagerHelper::class);
        $this->getContainer()->register(Services::CACHE)->setFactory([CacheService::class, 'getCache']);
        $this->getContainer()->register(Services::MENU_SERVICE, MenuService::class);
        $this->getContainer()->register(Services::MODULE_SERVICE, ModuleService::class);
        
        $this->registerCoreSubscribers();
    }

    private function registerCoreSubscribers(): void
    {
        $this->getEventDispatcher()->addSubscriber(new ExceptionSubscriber());
        $this->getEventDispatcher()->addListener(
            KernelEvents::REQUEST,
            [new SessionListener($this->getContainer()), 'onKernelRequest'],
        );
        $this->getEventDispatcher()->addSubscriber(new SessionSubscriber());
        $this->getEventDispatcher()->addSubscriber(new RequestForwardableExceptionSubscriber());
        $this->getEventDispatcher()->addSubscriber(new ScreenAuthorizationSubscriber());
        $this->getEventDispatcher()->addSubscriber(new ApiAuthorizationSubscriber());
        $this->getEventDispatcher()->addSubscriber(new RequestBodySubscriber());
        $this->getEventDispatcher()->addSubscriber(new MailerSubscriber());
        $this->getEventDispatcher()->addSubscriber(new ModuleNotAvailableSubscriber());
        $this->getEventDispatcher()->addSubscriber(new GlobalConfigSubscriber());
    }

    /**
     * @inheritDoc
     */
    public function registerCommands(Console $console): void
    {
        $console->add(new RunScheduleCommand());
    }

    /**
     * @param Request $request
     * @return SessionStorageInterface
     */
    private function getSessionStorage(Request $request): SessionStorageInterface
    {
        if ($request->headers->has('authorization')) {
            // To reduce session IO operations, handle in-memory session storage for token based clients
            return new MemorySessionStorage();
        }
        $isSecure = $request->isSecure();
        $path = $request->getBasePath();
        $options = [
            'name' => $isSecure ? 'optimust' : '_optimust',
            'cookie_secure' => $isSecure,
            'cookie_httponly' => true,
            'cookie_path' => $path == '' ? '/' : $path,
            'cookie_samesite' => 'Strict',
        ];
        return new NativeSessionStorage(
            $options,
            new NativeFileSessionHandler(Config::get(Config::SESSION_DIR))
        );
    }
}
