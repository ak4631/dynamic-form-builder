<?php

namespace Optimust\Core\Api\V1;

use Optimust\Core\Api\CommonParams;
use Optimust\Core\Api\V1\Exception\EndpointExceptionTrait;
use Optimust\Core\Api\V1\Validator\Helpers\ValidationDecorator;
use Optimust\Core\Api\V1\Validator\ParamRule;
use Optimust\Core\Api\V1\Validator\Rule;
use Optimust\Core\Api\V1\Validator\Rules;
use Optimust\Core\Dto\FilterParams;
use Optimust\ORM\ListSorter;

abstract class Endpoint
{
    use EndpointExceptionTrait;

    /**
     * @var Request
     */
    private Request $request;
    /**
     * @var RequestParams
     */
    private RequestParams $requestParams;

    /**
     * @var ValidationDecorator|null
     */
    private ?ValidationDecorator $validationDecorator = null;

    /**
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
        $this->requestParams = new RequestParams($request);
        $this->init();
    }

    /**
     * Init lifecycle hook for child classes
     */
    protected function init()
    {
    }

    /**
     * @return Request
     */
    protected function getRequest(): Request
    {
        return $this->request;
    }

    /**
     * @return RequestParams
     */
    protected function getRequestParams(): RequestParams
    {
        return $this->requestParams;
    }

    /**
     * @param RequestParams $requestParams
     * @internal
     */
    protected function setRequestParams(RequestParams $requestParams): void
    {
        $this->requestParams = $requestParams;
    }

    /**
     * @return ValidationDecorator
     */
    protected function getValidationDecorator(): ValidationDecorator
    {
        if (!$this->validationDecorator instanceof ValidationDecorator) {
            $this->validationDecorator = new ValidationDecorator();
        }
        return $this->validationDecorator;
    }

    /**
     * @param FilterParams $searchParamHolder
     * @param string|null $defaultSortField
     * @return FilterParams
     */
    protected function setSortingAndPaginationParams(
        FilterParams $searchParamHolder,
        ?string $defaultSortField = null
    ): FilterParams {
        $searchParamHolder->setSortField(
            $this->getRequestParams()->getStringOrNull(
                RequestParams::PARAM_TYPE_QUERY,
                CommonParams::PARAMETER_SORT_FIELD,
                $defaultSortField ?? $searchParamHolder->getSortField()
            )
        );
        $searchParamHolder->setSortOrder(
            $this->getRequestParams()->getString(
                RequestParams::PARAM_TYPE_QUERY,
                CommonParams::PARAMETER_SORT_ORDER,
                $searchParamHolder->getSortOrder()
            )
        );
        $searchParamHolder->setLimit(
            $this->getRequestParams()->getInt(
                RequestParams::PARAM_TYPE_QUERY,
                CommonParams::PARAMETER_LIMIT,
                FilterParams::DEFAULT_LIMIT
            )
        );
        $searchParamHolder->setOffset(
            $this->getRequestParams()->getInt(
                RequestParams::PARAM_TYPE_QUERY,
                CommonParams::PARAMETER_OFFSET,
                FilterParams::DEFAULT_OFFSET
            )
        );
        return $searchParamHolder;
    }

    /**
     * @param array $allowedSortFields
     * @param bool $excludeSortField
     * @return ParamRule[]
     */
    protected function getSortingAndPaginationParamsRules(
        array $allowedSortFields = [],
        bool $excludeSortField = false
    ): array {
        $rules = [
            $this->getValidationDecorator()->notRequiredParamRule(
                new ParamRule(
                    CommonParams::PARAMETER_SORT_ORDER,
                    new Rule(Rules::IN, [[ListSorter::ASCENDING, ListSorter::DESCENDING]])
                ),
                true
            ),
            $this->getValidationDecorator()->notRequiredParamRule(
                new ParamRule(
                    CommonParams::PARAMETER_LIMIT,
                    new Rule(Rules::ZERO_OR_POSITIVE), // Zero for not to limit results
                )
            ),
            $this->getValidationDecorator()->notRequiredParamRule(
                new ParamRule(
                    CommonParams::PARAMETER_OFFSET,
                    new Rule(Rules::ZERO_OR_POSITIVE)
                )
            ),
        ];
        if (!$excludeSortField) {
            $rules[] = $this->getValidationDecorator()->notRequiredParamRule(
                new ParamRule(
                    CommonParams::PARAMETER_SORT_FIELD,
                    new Rule(Rules::IN, [$allowedSortFields])
                )
            );
        }
        return $rules;
    }
}
