/**
 * Created by sridharrajs.
 */

angular
    .module('yabt')
    .directive('card', directive);

function directive() {
    return {
        scope: {
            data: '='
        },
        restrict: 'AE',
        replace: true,
        templateUrl: (element, attrs)=> {
            return attrs.templateurl || 'components/card.html';
        },
        controller: CardController,
        controllerAs: 'cardCtrl',
        bindToController: true
    };
}

function CardController(Article, SweetAlert, growl, $rootScope, $state) {

    const ALERT_OPTIONS = {
        title: 'You cannot undo a delete, Are you sure?',
        allowOutsideClick: true,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes',
        closeOnConfirm: true
    };

    let self = this;

    ({
        _id: self.id,
        tag: self.tag,
        title: self.title,
        url: self.url,
        is_fav: self.is_fav,
        description: self.description,
        tags: self.tags,
        host: self.host,
        notes: self.notes
    } = self.data);

    self.isUnreadsTab = $state.current.url === 'unreads';

    self.favourited = getFavourites(self.data.is_fav);
    self.deleteArticle = deleteArticle;
    self.archive = archive;
    self.favourite = favourite;

    function getFavourites(isFav) {
        return isFav === true ? 'favourited' : '';
    }

    function deleteArticle() {
        SweetAlert.swal(ALERT_OPTIONS, (isConfirm) => {
            if (isConfirm) {
                Article.deleteArticle(self.id).then((response)=> {
                    $(`#${self.id}`).remove();
                    self.alertMsg = 'Success!';
                    self.alertClass = 'show alert-success';
                    $rootScope.$broadcast('lessArticle');
                    growl.success('Success!');
                }).catch((err)=> {
                    self.alertMsg = err.data.msg;
                    growl.error(`Failed! - ${self.alertMsg}`);
                });
            }
        });
    }

    function archive() {
        Article.archive(self.id).then(()=> {
            $(`#${self.id}`).remove();
            $rootScope.$broadcast('lessArticle');
            growl.success('Success!');
        }).catch((err)=> {
            self.alertMsg = err.data.msg;
            growl.error(`Failed! - ${self.alertMsg}`);
        });
    }

    function favourite() {
        let newStatus = !self.is_fav;
        Article.favourite({
            articleId: self.id,
            isFavourited: newStatus
        }).then(()=> {
            self.is_fav = newStatus;
            self.favourited = getFavourites(newStatus);
        });
    }

}
