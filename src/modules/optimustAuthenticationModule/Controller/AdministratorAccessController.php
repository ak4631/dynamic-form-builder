<?php

namespace Optimust\Authentication\Controller;

use Optimust\Authentication\Auth\User as AuthUser;
use Optimust\Authentication\Traits\CsrfTokenManagerTrait;
use Optimust\Core\Authorization\Service\HomePageService;
use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\Traits\Auth\AuthUserTrait;
use Optimust\Core\Traits\ORM\EntityManagerHelperTrait;
use Optimust\Core\Traits\UserRoleManagerTrait;
use Optimust\Core\React\Component;
use Optimust\Core\React\Prop;
use Optimust\Framework\Http\Request;

class AdministratorAccessController extends AbstractReactController
{
    use AuthUserTrait;
    use EntityManagerHelperTrait;
    use UserRoleManagerTrait;
    use CsrfTokenManagerTrait;

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
     * @inheritDoc
     */
    public function preRender(Request $request): void
    {
        $component = new Component('auth-admin-access');

        $forwardUrl = $request->query->get('forward');
        if (!is_null($forwardUrl)) {
            $this->getAuthUser()->setAttribute(AuthUser::ADMIN_ACCESS_FORWARD_URL, $forwardUrl);
        }

        $backUrl = $this->getAuthUser()->getAttribute(AuthUser::ADMIN_ACCESS_BACK_URL);

        /*
         * IF user has a flash error, set the error prop only
         * This means the user has been redirected due to invalid credentials
         * Therefore, backUrl from query param will be null anyway
         * ELSE there is no flash error, get the backUrl from query parameter
         * In this case, they have accessed the page and not been redirected due to invalid credentials
         * If backUrl from query param is null, set backUrl as homepage path
         */
        if ($this->getAuthUser()->hasFlash(AuthUser::FLASH_VERIFY_ERROR)) {
            $error = $this->getAuthUser()->getFlash(AuthUser::FLASH_VERIFY_ERROR);
            $component->addProp(
                new Prop(
                    'error',
                    Prop::TYPE_OBJECT,
                    $error[0] ?? []
                )
            );
        } else {
            $queryBackUrl = $request->query->get('back');
            $backUrl = $queryBackUrl ?? '/' . $this->getHomePageService()->getHomePagePath();
            $this->getAuthUser()->setAttribute(AuthUser::ADMIN_ACCESS_BACK_URL, $backUrl);
        }

        $component->addProp(
            new Prop('back-url', Prop::TYPE_STRING, $backUrl)
        );

        $username = $this->getUserRoleManager()->getUser()->getUserName();
        $component->addProp(
            new Prop('username', Prop::TYPE_STRING, $username)
        );

        $component->addProp(
            new Prop(
                'token',
                Prop::TYPE_STRING,
                $this->getCsrfTokenManager()->getToken('administrator-access')->getValue()
            )
        );

        $this->setTemplate('no_header.html.twig');
        $this->setComponent($component);
    }
}
