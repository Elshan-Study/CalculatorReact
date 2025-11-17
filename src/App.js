import logo from './logo.svg';
import './App.css';
import {useState} from "react";
import ButtonList from "./ButtonList";


const action_buttons = ["C", "⌫"];
const data_buttons = ["(", ")", "7", "8", "9", "÷", "4", "5", "6", "*", "1", "2", "3", "0", ".", "="];

let expression = '';


function App() {

    let [counter, setCounter] = useState("0");

    function previewEval(expr) {
        if (!expr) return '';
        let e = expr.replace(/[×÷]/g, function(m){ return m === '×' ? '*' : '/'; });
        while (e.length && /[+\-*/.]$/.test(e)) e = e.slice(0, -1);
        if (!e) return '';
        if (!/^[0-9+\-*/().\s]+$/.test(e)) throw new Error('invalid chars');
        const result = Function('"use strict";return (' + e + ')')();
        if (!isFinite(result)) throw new Error('math error');
        return formatNum(result);
    }

    function formatNum(n) {
        if (Math.abs(n - Math.round(n)) < 1e-12) return String(Math.round(n));
        return parseFloat(n.toFixed(12)).toString();
    }

    function appendValue(v) {
        if (v === '×' || v === '÷') {
            v = v === '×' ? '*' : '/';
        }
        const ops = ['+','-','*','/'];
        const last = expression.slice(-1);
        if (ops.includes(v)) {
            if (expression === '' && v !== '-') return;
            if (ops.includes(last)) {
                if (v === '-' && last !== '-') {
                    expression += v;
                } else {
                    expression = expression.slice(0, -1) + v;
                }
                return;
            }
        }
        if (v === '.') {
            const token = expression.match(/([0-9]*\.?[0-9]*)$/);
            if (token && token[0].includes('.')) return;
            if (!token || token[0] === '') v = '0.';
        }
        expression += v;
        setCounter(expression);
    }

    function clearAll() {
        expression = '';
        setCounter(expression);
    }
    function backspace() {
        expression = expression.slice(0, -1);
        setCounter(expression);
    }
    function evaluate() {
        try {
            const r = previewEval(expression);
            expression = r === '' ? '' : String(r);
            setCounter(expression);
        } catch (e) {
            setCounter("Error");
        }
    }

    function CalculateButtons(button_context) {
        if (button_context === 'C') clearAll();
        else if (button_context === '⌫') backspace();
        else if (button_context === '=') evaluate();
        else appendValue(button_context);
    }

  return (
      <section className="card calculator" aria-label="Калькулятор">
          <div className="display">
              <div id="expr" className="expr">&nbsp;</div>
              <div id="res" className="res">{counter}</div>
          </div>

          <div className="keys">
              <ButtonList myButtons={action_buttons} onClick={CalculateButtons}></ButtonList>
              <ButtonList myButtons={data_buttons} onClick={CalculateButtons}></ButtonList>
          </div>
          <p className="hint">Клавиатура: цифры, + - * / ( ), Enter =, Backspace, Esc — очистка.</p>
      </section>
  );
}

export default App;
