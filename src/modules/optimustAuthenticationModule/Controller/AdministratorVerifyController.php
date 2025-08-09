<?php

namespace Optimust\Authentication\Controller;

use Optimust\Authentication\Auth\User as AuthUser;
use Optimust\Authentication\Dto\UserCredential;
use Optimust\Authentication\Exception\AuthenticationException;
use Optimust\Authentication\Service\AuthenticationService;
use Optimust\Authentication\Service\LoginService;
use Optimust\Authentication\Traits\CsrfTokenManagerTrait;
use Optimust\Core\Controller\AbstractController;
use Optimust\Core\Controller\Exception\RequestForwardableException;
use Optimust\Core\Traits\Auth\AuthUserTrait;
use Optimust\Core\Traits\UserRoleManagerTrait;
use Optimust\Framework\Http\RedirectResponse;
use Optimust\Framework\Http\Request;
use Optimust\Framework\Http\Response;

class AdministratorVerifyController extends AbstractController
{
    use AuthUserTrait;
    use UserRoleManagerTrait;
    use CsrfTokenManagerTrait;

    public const PARAMETER_PASSWORD = 'password';

    protected ?AuthenticationService $authenticationService = null;
    protected ?LoginService $loginService = null;

    /**
     * @return AuthenticationService
     */
    public function getAuthenticationService(): AuthenticationService
    {
        if (!$this->authenticationService instanceof AuthenticationService) {
            $this->authenticationService = new AuthenticationService();
        }
        return $this->authenticationService;
    }

    /**
     * @return LoginService
     */
    public function getLoginService(): LoginService
    {
        if (!$this->loginService instanceof LoginService) {
            $this->loginService = new LoginService();
        }
        return $this->loginService;
    }

    /**
     * @param Request $request
     * @return Response|RedirectResponse
     * @throws RequestForwardableException
     */
    public function handle(Request $request)
    {
        if (!$this->getUserRoleManager()->getDataGroupPermissions('auth_admin_verify')->canRead()) {
            throw new RequestForwardableException(ForbiddenController::class . '::handle');
        }

        $username = $this->getUserRoleManager()->getUser()->getUserName();
        $password = $request->request->get(self::PARAMETER_PASSWORD, '');
        $credentials = new UserCredential($username, $password);

        try {
            $token = $request->request->get('_token');
            if (!$this->getCsrfTokenManager()->isValid('administrator-access', $token)) {
                throw AuthenticationException::invalidCsrfToken();
            }
            $success = $this->getAuthenticationService()->setCredentials($credentials);
            if (!$success) {
                throw AuthenticationException::invalidCredentials();
            }
            $this->getAuthUser()->setHasAdminAccess(true);
            $this->getLoginService()->addLogin($credentials);

            $forwardUrl = $this->getAuthUser()->getAttribute(AuthUser::ADMIN_ACCESS_FORWARD_URL);

            $this->getAuthUser()->removeAttribute(AuthUser::ADMIN_ACCESS_FORWARD_URL);
            $this->getAuthUser()->removeAttribute(AuthUser::ADMIN_ACCESS_BACK_URL);

            return $this->redirect($forwardUrl);
        } catch (AuthenticationException $e) {
            $this->getAuthUser()->addFlash(AuthUser::FLASH_VERIFY_ERROR, $e->normalize());
            return $this->forward(AdministratorAccessController::class . '::handle');
        }
    }
}
