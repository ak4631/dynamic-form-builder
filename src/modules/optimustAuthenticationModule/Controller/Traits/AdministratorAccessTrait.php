<?php

namespace Optimust\Authentication\Controller\Traits;

use LogicException;
use Optimust\Authentication\Controller\AdministratorAccessController;
use Optimust\Authentication\Controller\AdminPrivilegeController;
use Optimust\Authentication\Controller\ForbiddenController;
use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\Controller\Exception\RequestForwardableException;
use Optimust\Core\Traits\Service\TextHelperTrait;
use Optimust\Framework\Http\Request;
use Optimust\Framework\Http\Response;
use Optimust\Framework\Routing\UrlMatcher;
use Optimust\Framework\Services;
use Symfony\Component\OptionsResolver\Exception\NoConfigurationException;
use Symfony\Component\Routing\Exception\MethodNotAllowedException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

trait AdministratorAccessTrait
{
    use TextHelperTrait;

    /**
     * @param Request $request Provide request from handle method in controller
     * @return Response
     */
    public function forwardToAdministratorAccess(Request $request): Response
    {
        if (!$this instanceof AdminPrivilegeController) {
            throw new LogicException(
                'Trait should be used in class that implements ' . AdminPrivilegeController::class
            );
        }
        if (!$this instanceof AbstractReactController) {
            throw new LogicException(
                'Trait should be used in class that extends ' . AbstractReactController::class
            );
        }

        $currentRequest = $this->getCurrentRequest();
        $forwardUrl = $currentRequest->getPathInfo();

        $backUrl = $request->headers->get('referer');

        // Some instances where null: if page is accessed via bookmark, user manually entered URL, etc.
        if (is_null($backUrl)) {
            return $this->forward(
                AdministratorAccessController::class . '::handle',
                [],
                ['forward' => $forwardUrl, 'back' => $backUrl]
            );
        }

        $baseUrl = $currentRequest->getSchemeAndHttpHost() . $currentRequest->getBaseUrl();
        $textHelper = $this->getTextHelper();

        // Will fail if backUrl: contains a different base url or host || contains api/v1 in the string
        if (!$textHelper->strContains($backUrl, $baseUrl) || $textHelper->strContains($backUrl, 'api/v1')) {
            throw new RequestForwardableException(ForbiddenController::class . '::handle');
        }

        $formattedBackUrl = str_replace($baseUrl, '', $backUrl);
        /** @var UrlMatcher $urlMatcher */
        $urlMatcher = $this->getContainer()->get(Services::ROUTER);
        try {
            $urlMatcher->match($formattedBackUrl);
        } catch (ResourceNotFoundException | NoConfigurationException | MethodNotAllowedException $e) {
            throw new RequestForwardableException(ForbiddenController::class . '::handle');
        }

        return $this->forward(
            AdministratorAccessController::class . '::handle',
            [],
            ['forward' => $forwardUrl, 'back' => $formattedBackUrl]
        );
    }
}
