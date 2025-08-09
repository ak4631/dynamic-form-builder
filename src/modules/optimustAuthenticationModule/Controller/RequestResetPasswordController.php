<?php

namespace Optimust\Authentication\Controller;

use Optimust\Authentication\Exception\AuthenticationException;
use Optimust\Authentication\Service\ResetPasswordService;
use Optimust\Authentication\Traits\CsrfTokenManagerTrait;
use Optimust\Core\Controller\AbstractController;
use Optimust\Core\Controller\PublicControllerInterface;
use Optimust\Entity\User;
use Optimust\Framework\Http\RedirectResponse;
use Optimust\Framework\Http\Request;
use Optimust\Framework\Http\Response;

class RequestResetPasswordController extends AbstractController implements PublicControllerInterface
{
    use CsrfTokenManagerTrait;

    protected ?ResetPasswordService $resetPasswordService = null;

    /**
     * @return ResetPasswordService
     */
    public function getResetPasswordService(): ResetPasswordService
    {
        if (!$this->resetPasswordService instanceof ResetPasswordService) {
            $this->resetPasswordService = new ResetPasswordService();
        }
        return $this->resetPasswordService;
    }

    /**
     * @param Request $request
     * @return Response|RedirectResponse
     */
    public function handle(Request $request): RedirectResponse
    {
        $token = $request->request->get('_token');
        if (!$this->getCsrfTokenManager()->isValid('request-reset-password', $token)) {
            throw AuthenticationException::invalidCsrfToken();
        }
        $username = $request->request->get('username');
        if (($user = $this->getResetPasswordService()->searchForUserRecord($username)) instanceof User) {
            $this->getResetPasswordService()->logPasswordResetRequest($user);
        }
        return $this->redirect('auth/sendPasswordReset');
    }
}
