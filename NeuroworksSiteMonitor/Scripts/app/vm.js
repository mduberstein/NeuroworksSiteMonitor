define('vm',
[
        'vm.shell'
        ,'vm.machines'
        ,'vm.machine'
//        ,'vm.controlled'
],
    function (shell, machines, machine) {
        return {
            shell: shell
            , machines: machines
            , machine: machine
            //, controlled: controlled
    };
});