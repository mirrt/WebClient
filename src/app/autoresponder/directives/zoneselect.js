import _ from 'lodash';

/* @ngInject */
function zoneselect($rootScope, autoresponderModel) {
    return {
        replace: true,
        restrict: 'E',
        template:
            '<select id="time-zone" name="time-zone" ng-options="zone.label for zone in timezones track by zone.value" ng-model="zone"></select>',
        scope: {},
        link(scope, elem, { zone, disableInput }) {
            const unsubscribe = [];

            scope.timezones = autoresponderModel.timezones;

            if (disableInput === 'true') {
                elem.attr('disabled', 'disabled');
            }

            scope.zone = _.find(scope.timezones, { value: zone });

            const onChange = () => {
                scope.$applyAsync(() => autoresponderModel.set({ zone: scope.zone.value }));
            };

            unsubscribe.push(
                $rootScope.$on('autoresponder', (event, { type, data = {} }) => {
                    if (type === 'update') {
                        scope.zone = _.find(scope.timezones, { value: data.autoresponder.zone });
                    }
                })
            );

            elem.on('change', onChange);

            scope.$on('$destroy', () => {
                _.each(unsubscribe, (cb) => cb());
                unsubscribe.length = 0;
            });
        }
    };
}
export default zoneselect;
