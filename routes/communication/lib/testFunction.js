/**
 * Created by admin on 2016/3/8.
 */
function isEmpty(obj) {
    for (var name in obj) {
        return false;
    }
    return true;
}



exports.isEmpty = isEmpty;
