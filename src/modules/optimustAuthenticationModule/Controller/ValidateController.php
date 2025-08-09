<?php

namespace Optimust\Authentication\Controller;

use Optimust\Authentication\Auth\AuthProviderChain;
use Optimust\Authentication\Auth\User as AuthUser;
use Optimust\Authentication\Dto\AuthParams;
use Optimust\Authentication\Dto\UserCredential;
use Optimust\Authentication\Exception\AuthenticationException;
use Optimust\Authentication\Service\LoginService;
use Optimust\Authentication\Traits\CsrfTokenManagerTrait;
use Optimust\Core\Authorization\Service\HomePageService;
use Optimust\Core\Controller\AbstractController;
use Optimust\Core\Controller\PublicControllerInterface;
use Optimust\Core\Exception\RedirectableException;
use Optimust\Core\Traits\Auth\AuthUserTrait;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Http\RedirectResponse;
use Optimust\Framework\Http\Request;
use Optimust\Framework\Http\Session\Session;
use Optimust\Framework\Routing\UrlGenerator;
use Optimust\Framework\Services;
use Throwable;

class ValidateController extends AbstractController implements PublicControllerInterface
{
    use AuthUserTrait;
    use ServiceContainerTrait;
    use CsrfTokenManagerTrait;

    public const PARAMETER_USERNAME = 'username';
    public const PARAMETER_PASSWORD = 'password';

    /**
     * @var null|LoginService
     */
    protected ?LoginService $loginService = null;

    /**
     * @var HomePageService|null
     */
    protected ?HomePageService $homePageService = null;

    /**
     * @return HomePageService
     */
    public function getHomePageService(): HomePageService
    {
        if (!$this->homePageService instanceof HomePageService) {
            $this->homePageService = new HomePageService();
        }
        return $this->homePageService;
    }

    /**
     * @return LoginService
     */
    public function getLoginService(): LoginService
    {
        if (is_null($this->loginService)) {
            $this->loginService = new LoginService();
        }
        return $this->loginService;
    }

    public function handle(Request $request): RedirectResponse
    {
        $username = $request->request->get(self::PARAMETER_USERNAME, '');
        $password = $request->request->get(self::PARAMETER_PASSWORD, '');
        $credentials = new UserCredential($username, $password);

        /** @var UrlGenerator $urlGenerator */
        $urlGenerator = $this->getContainer()->get(Services::URL_GENERATOR);
        $loginUrl = $urlGenerator->generate('auth_login', [], UrlGenerator::ABSOLUTE_URL);

        try {
            $token = $request->request->get('_token');
            if (!$this->getCsrfTokenManager()->isValid('login', $token)) {
                throw AuthenticationException::invalidCsrfToken();
            }

            /** @var AuthProviderChain $authProviderChain */
            $authProviderChain = $this->getContainer()->get(Services::AUTH_PROVIDER_CHAIN);
            $success = $authProviderChain->authenticate(new AuthParams($credentials));

            if (!$success) {
                throw AuthenticationException::invalidCredentials();
            }
            $this->getAuthUser()->setIsAuthenticated($success);
            $this->getLoginService()->addLogin($credentials);
        } catch (AuthenticationException $e) {
            $this->getAuthUser()->addFlash(AuthUser::FLASH_LOGIN_ERROR, $e->normalize());
            if ($e instanceof RedirectableException) {
                return new RedirectResponse($e->getRedirectUrl());
            }
            return new RedirectResponse($loginUrl);
        } catch (Throwable $e) {
            $this->getAuthUser()->addFlash(
                AuthUser::FLASH_LOGIN_ERROR,
                [
                    'error' => AuthenticationException::UNEXPECT_ERROR,
                    'message' => 'Unexpected error occurred',
                ]
            );
            return new RedirectResponse($loginUrl);
        }

        /** @var Session $session */
        $session = $this->getContainer()->get(Services::SESSION);
        //Recreate the session
        $session->migrate(true);

        if ($this->getAuthUser()->hasAttribute(AuthUser::SESSION_TIMEOUT_REDIRECT_URL)) {
            $redirectUrl = $this->getAuthUser()->getAttribute(AuthUser::SESSION_TIMEOUT_REDIRECT_URL);
            $this->getAuthUser()->removeAttribute(AuthUser::SESSION_TIMEOUT_REDIRECT_URL);
            $logoutUrl = $urlGenerator->generate('auth_logout', [], UrlGenerator::ABSOLUTE_URL);

            if ($redirectUrl !== $loginUrl || $redirectUrl !== $logoutUrl) {
                return new RedirectResponse($redirectUrl);
            }
        }

        $homePagePath = $this->getHomePageService()->getHomePagePath();
        return $this->redirect($homePagePath);
    }
}
