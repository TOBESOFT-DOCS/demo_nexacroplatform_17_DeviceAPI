if (nexacro.ExtEdit)
{
    var _pExtEdit = nexacro.ExtEdit.prototype;

    /*
    // Metainfo의 Default 값과 별개로 기본으로 세팅해줘야 할 Property를 세팅한다.
    // (taborder는 designform에서 직접 설정한다)
    */
    _pExtEdit._initDesignDefaultProperty = function ()
    {
        // TODO :
    };

    /*
    Css Editor에서 미리보기시에 적용할 Contents를 설정합니다.
    */
    _pExtEdit.createCssDesignContents = function ()
    {
        // TODO :
    };


    // Design 화면에서 적용할 함수를 재정의 합니다.
    // TODO :

    delete _pExtEdit;
}


