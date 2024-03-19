var modal1 = mkt.Q("dialog#modal1");
var modal2 = mkt.Q("dialog#modal2");

function abrirModal1() {
	mkt.Q("dialog#modal1").showModal();
}

function abrirModal2() {
	mkt.Q("dialog#modal2").showModal();
}

function fecharModal1() {
	mkt.Q("dialog#modal1").close();
}

function fecharModal2() {
	mkt.Q("dialog#modal2").close();
}