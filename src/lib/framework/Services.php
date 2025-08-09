<?php

namespace Optimust\Framework;

final class Services
{
    /**
     * @see \Optimust\Framework\Http\RequestStack
     */
    public const REQUEST_STACK = 'request_stack';

    /**
     * @see \Optimust\Framework\Routing\RequestContext
     */
    public const ROUTER_REQUEST_CONTEXT = 'router.request_context';

    /**
     * @see \Optimust\Framework\Routing\UrlMatcher
     */
    public const ROUTER = 'router.default';

    /**
     * @see \Optimust\Framework\Event\EventDispatcher
     */
    public const EVENT_DISPATCHER = 'event_dispatcher';

    /**
     * @see \Optimust\Framework\Http\ControllerResolver
     */
    public const CONTROLLER_RESOLVER = 'controller_resolver';

    /**
     * @see \Symfony\Component\HttpKernel\Controller\ArgumentResolver
     */
    public const ARGUMENT_RESOLVER = 'argument_resolver';

    /**
     * @see \Optimust\Framework\Framework
     */
    public const HTTP_KERNEL = 'http_kernel';

    /**
     * @see \Optimust\Framework\Http\Session\NativeSessionStorage
     */
    public const SESSION_STORAGE = 'session_storage';

    /**
     * @see \Optimust\Framework\Http\Session\Session
     */
    public const SESSION = 'session';

    /**
     * @see \Optimust\Framework\Logger\Logger
     */
    public const LOGGER = 'logger';

    /**
     * @see \Optimust\Framework\Routing\UrlGenerator
     */
    public const URL_GENERATOR = 'url_generator';

    /**
     * @see \Symfony\Component\HttpFoundation\UrlHelper
     */
    public const URL_HELPER = 'url_helper';

    /**
     * @see \Doctrine\ORM\EntityManager
     */
    public const DOCTRINE = 'doctrine.entity_manager';

    ///////////////////////////////////////////////////////////////
    /// Core module services
    ///////////////////////////////////////////////////////////////

    /**
     * @see \Optimust\Core\Service\ConfigService
     */
    public const CONFIG_SERVICE = 'core.config_service';

    /**
     * @see \Optimust\Core\Service\NormalizerService
     */
    public const NORMALIZER_SERVICE = 'core.normalizer_service';

    /**
     * @see \Optimust\Core\Service\DateTimeHelperService
     */
    public const DATETIME_HELPER_SERVICE = 'core.datetime_helper_service';

    /**
     * @see \Optimust\Core\Service\TextHelperService
     */
    public const TEXT_HELPER_SERVICE = 'core.text_helper_service';

    /**
     * @see \Optimust\Core\Service\TextHelperService
     */
    public const NUMBER_HELPER_SERVICE = 'core.number_helper_service';

    /**
     * @see \Optimust\Core\Helper\ClassHelper
     */
    public const CLASS_HELPER = 'core.class_helper';

    /**
     * @see \Optimust\Core\Authorization\Manager\AbstractUserRoleManager
     */
    public const USER_ROLE_MANAGER = 'core.authorization.user_role_manager';

    /**
     * @see \Optimust\Core\Authorization\Helper\UserRoleManagerHelper
     */
    public const USER_ROLE_MANAGER_HELPER = 'core.authorization.user_role_manager_helper';

    /**
     * @see \Optimust\Framework\Cache\FilesystemAdapter
     * @see \Symfony\Component\Cache\Adapter\AdapterInterface
     */
    public const CACHE = 'core.cache';

    /**
     * @see \Optimust\Core\Service\MenuService
     */
    public const MENU_SERVICE = 'core.menu_service';

    /**
     * @see \Optimust\Core\Service\ReportGeneratorService
     */
    public const REPORT_GENERATOR_SERVICE = 'core.report_generator_service';

    /**
     * @see \Optimust\Core\Service\ModuleService
     */
    public const MODULE_SERVICE = 'core.module_service';

    ///////////////////////////////////////////////////////////////
    /// Authentication module services
    ///////////////////////////////////////////////////////////////

    /**
     * @see \Optimust\Authentication\Auth\User
     */
    public const AUTH_USER = 'auth.user';

    /**
     * @see \Optimust\Authentication\Auth\AuthProviderChain
     */
    public const AUTH_PROVIDER_CHAIN = 'auth.provider_chain';

    /**
     * @see \Optimust\Authentication\Csrf\CsrfTokenManager
     */
    public const CSRF_TOKEN_MANAGER = 'auth.csrf_token_manager';

    /**
     * @see \Symfony\Component\Security\Csrf\TokenStorage\NativeSessionTokenStorage
     * @see \Symfony\Component\Security\Csrf\TokenStorage\TokenStorageInterface
     */
    public const CSRF_TOKEN_STORAGE = 'auth.csrf_token_storage';

    /**
     * @see \Optimust\Authentication\Service\PasswordStrengthService
     */
    public const PASSWORD_STRENGTH_SERVICE = 'auth.password_strength_service';

    ///////////////////////////////////////////////////////////////
    /// Admin module services
    ///////////////////////////////////////////////////////////////

    /**
     * @see \Optimust\Admin\Service\UserService
     */
    public const USER_SERVICE = 'admin.user_service';

}
